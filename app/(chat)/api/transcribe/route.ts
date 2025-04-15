import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// New way to configure the route
export const runtime = 'edge'; // 'nodejs' or 'edge'
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { message: 'No audio file provided or invalid format' },
        { status: 400 }
      );
    }

    // Convert Blob to File with proper naming
    const file = new File([audioFile], 'audio.webm', { type: audioFile.type });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "gpt-4o-mini-transcribe",
      prompt:"The following conversation is between you (language tutor) and a student or practioner, about books, papers, etc. So you'll notice some portuguese words.",
      response_format: "json", // Ensure JSON response
    });

    return NextResponse.json({ 
      text: transcription.text,
      success: true 
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Transcription failed',
        success: false
      },
      { status: 500 }
    );
  }
}

