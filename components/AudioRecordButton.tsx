import { useState, useRef } from 'react';
import { MicrophoneIcon, StopIcon, LoadingIcon } from '@/components/icons';

interface AudioRecordButtonProps {
  onTranscriptionComplete: (text: string) => void;
}

export function AudioRecordButton({ onTranscriptionComplete }: AudioRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Specify MP3 format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transcription failed');
      }

      const { text } = await response.json();
      onTranscriptionComplete(text);
    } catch (error) {
      console.error('Transcription error:', error);
      // You might want to show this error to the user
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className="flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer hover:bg-neutral-400 dark:text-zinc-900 transition-colors"
      title={isRecording ? "Stop recording" : "Start recording"}
    >
      {isProcessing ? (
        <LoadingIcon className="w-4 h-4 animate-spin" />
      ) : isRecording ? (
        <StopIcon className="w-4 h-4 text-red-500" />
      ) : (
        <MicrophoneIcon className="w-4 h-4" />
      )}
    </button>
  );
}