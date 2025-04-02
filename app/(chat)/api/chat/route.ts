import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createMessage } from "@/app/db";
import { convertToCoreMessages, streamText} from "ai";
//import { openai } from "@ai-sdk/openai";


export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  

  const result = await streamText({
    model: customModel,
    //tools,
    maxSteps: 5,
    system: ` You are an english tutor who students learn the concepts of what the professor is currently teaching.
      - Ensure the text is grammatically correct and easy to understand, providing hints or tips along the way to help students improve their English skills, always give real time feedback.
      - Be concise and brief, no matter the request
      - Follow the material on your vector knowledge base when students ask subjects questions
      - And then use the mcp web_search tool to find real time data and relevant materials on the topic
      # Always cite your sources for web, rag or dictionary, example: "According to <url>"`,
    messages: convertToCoreMessages(messages),
    /*tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: 'low',
        userLocation: {
          type: 'approximate',
          country: "BR"
        },
      }),
    }, */
    experimental_providerMetadata: {
      files: {
        selection: selectedFilePathnames,
      },
    },
    onFinish: async ({ text }) => {
      await createMessage({
        id,
        messages: [...messages, { role: "assistant", content: text }],
        author: session.user?.email!,
      });
    },
    experimental_telemetry: { isEnabled: true },
  });

  return result.toDataStreamResponse({
    sendSources: true,
  });
}