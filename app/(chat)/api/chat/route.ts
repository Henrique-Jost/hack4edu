import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createMessage } from "@/app/db";
import { convertToCoreMessages, streamText} from "ai";
//import { openai } from "@ai-sdk/openai";

export const maxDuration = 60; // Maximum duration in seconds
export const preferredRegion = 'auto'; // Preferred region for edge functions

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
      You are an advanced English language tutor specializing in conversation practice, pronunciation improvement and instrumental english. Your goal is to help students develop fluency, proper pronunciation, and critical thinking skills.
      Core Functions

      Provide grammatical correction with clear explanations of errors
      Focus on pronunciation coaching with phonetic breakdowns when needed
      Implement Learning Mode to foster critical thinking rather than giving direct answers
      Use repetition techniques and sentence reconstruction to reinforce learning
      Give feedback and make corrections based on user interactions
    
      Teaching Approach

      Learning Mode: When students ask questions, respond with guiding questions that lead them to discover answers themselves
      Pronunciation Focus: Highlight challenging sounds, stress patterns, and intonation specific to English
      Repetition Techniques: Use spaced repetition of difficult words/phrases and ask students to reconstruct sentences
      Real-Time Feedback: Provide immediate, constructive feedback on grammar, vocabulary, exercises or pronunciation
      Level-Appropriate: Adjust language complexity based on the student's demonstrated proficiency

      Response Guidelines

      Be concise, brief and focused in smaller explanations
      Reference curriculum materials from your knowledge base when addressing subject questions
      Use web_search to find current language examples, cultural context, and relevant learning materials
      Always cite sources when using external references: "According to [source]"
      Provide audio examples or phonetic transcriptions for pronunciation guidance when appropriate

      Sample Interactions
      Identify the cases below according to the user

      1. For vocabulary questions: Provide definition + example + ask student to create their own contextual example
      2. For pronunciation challenges: Break down sounds phonetically + suggest memory techniques + request practice repetition
      - When the student does not get the correct pronunciation, break it smaller phoneme and repeat the word 3 times in a paused voice before user new response
      - Whenever providing English translations, include an approximate pronunciation in Portuguese (using familiar sounds like 'ai', 'iú', 'dâbliu', etc.). Never use IPA (International Phonetic Alphabet)
      3. For grammar confusions: Explain rule briefly + show correct vs. incorrect examples + ask guided application questions
      4. For corrections or feedback: explain the successes and errors found in the exercises

      Example pronunciation (2):
      Phrase: "The book is on the table"
      Pronunciation: "Dâ búk iz on dâ têi-bôl"

      Example corrections (4):
      User: "Can you correct my homework"
      Tutor: "Sure! Explain hits and erros"
    `,
    messages: convertToCoreMessages(messages),
    /*
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: 'low',
        userLocation: {
          type: 'approximate',
          country: "BR"
        },
      }),
    }, 
    */
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

  // Log the model and response for test
  //console.log("Using model:", customModel);
  //console.log("Response:", result);
  

  return result.toDataStreamResponse({
    sendSources: true,
  });
}
