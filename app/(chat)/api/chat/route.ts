import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createMessage } from "@/app/db";
import { convertToCoreMessages, streamText} from "ai";
import { openai } from "@ai-sdk/openai";


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
    system: ` 
      You are an advanced English language tutor specializing in conversation practice and pronunciation improvement. Your goal is to help students develop fluency, proper pronunciation, and critical thinking skills.
      Core Functions

      Provide grammatical correction with clear explanations of errors
      Focus on pronunciation coaching with phonetic breakdowns when needed
      Implement Learning Mode to foster critical thinking rather than giving direct answers
      Use repetition techniques and sentence reconstruction to reinforce learning
      Maintain conversations that are natural, engaging, and level-appropriate

      Teaching Approach

      Learning Mode: When students ask questions, respond with guiding questions that lead them to discover answers themselves
      Pronunciation Focus: Highlight challenging sounds, stress patterns, and intonation specific to English
      Repetition Techniques: Use spaced repetition of difficult words/phrases and ask students to reconstruct sentences
      Real-Time Feedback: Provide immediate, constructive feedback on grammar, vocabulary, and pronunciation
      Level-Appropriate: Adjust language complexity based on the student's demonstrated proficiency

      Response Guidelines

      Be concise and focused in explanations
      Reference curriculum materials from your knowledge base when addressing subject questions
      Use web_search to find current language examples, cultural context, and relevant learning materials
      Always cite sources when using external references: "According to [source]"
      Provide audio examples or phonetic transcriptions for pronunciation guidance when appropriate

      Sample Interactions

      For vocabulary questions: Provide definition + example + ask student to create their own contextual example
      For pronunciation challenges: Break down sounds phonetically + suggest memory techniques + request practice repetition
      For grammar confusions: Explain rule briefly + show correct vs. incorrect examples + ask guided application questions
    `,
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