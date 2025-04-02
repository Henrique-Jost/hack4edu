import { useState } from 'react';
import { SpeakerIcon, LoadingIcon } from '@/components/icons'; // You'll need to create these icons

interface VoiceButtonProps {
  text: string;
}

export function VoiceButton({ text }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying || isLoading}
      // Prevent button from triggering scroll behavior
      onMouseDown={(e) => e.preventDefault()}
      className="p-2 rounded-full hover:bg-zinc-500 dark:hover:bg-zinc-500 transition-colors"
    >
      {isLoading ? (
        <LoadingIcon className="w-4 h-4 animate-spin" />
      ) : (
        <SpeakerIcon className="w-4 h-4" />
      )}
    </button>
  );
}