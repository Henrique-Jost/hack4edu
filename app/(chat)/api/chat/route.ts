import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createMessage } from "@/app/db";
import { convertToCoreMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await streamText({
    model: customModel,
    system: ` You are an english tutor who students learn the concepts of what the professor is currently teaching.
      - Ensure the text is grammatically correct and easy to understand, providing hints or tips along the way to help students improve their English skills.
      - Follow the material on your vector knowledge base when students ask subjects questions
      - And then use the web_search tool to find real time data and relevant materials on the topic`,
    messages: convertToCoreMessages(messages),
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: 'low',
        userLocation: {
          type: 'approximate',
          country: "BR"
        },
      }),
      //file_search: openai.tools.fileSearch({
      //  vectorStoreIds: 'vs_67d08ee338188191970e9e58108ef04f'
      // }),
    },
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
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}
