import OpenAI from "openai";

const openai = new OpenAI();

const instructions = "Affect/personality: A cheerful happey friend \n\nTone: Friendly, clear, empathic and reassuring, creating a calm atmosphere and making the listener feel confident and comfortable.\n\nPronunciation: Clear, articulate, and steady, ensuring each instruction is easily understood while maintaining a natural, conversational flow.\n\nPause: Brief, purposeful pauses after key instructions (e.g., \"cross the street\" and \"turn right\") to allow time for the listener to process the information and follow along.\n\nEmotion: Warm and supportive, conveying empathy and care, ensuring the listener feels guided and safe throughout the journey.";

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "nova",
      instructions,
      input: text,
      response_format: "mp3",
    });

    // Convert the raw response to a ReadableStream
    const audioStream = response.body;
    
    return new Response(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response('Text-to-speech conversion failed', { status: 500 });
  }
}