import { VoiceSettings } from '../types';
import { AudioFormat } from '../components/AudioFormatModal';
import { recordSpeechSynthesis, downloadAudioBlob } from './audioRecorder';

export const downloadAudio = async (
  text: string,
  settings: VoiceSettings,
  format: AudioFormat = 'wav'
): Promise<void> => {
  try {
    // Note: Web Speech API has limitations for direct audio recording
    // This is a fallback implementation
    const blob = await recordSpeechSynthesis(text, settings);
    const extension = format === 'mp3' ? 'mp3' : format === 'ogg' ? 'ogg' : 'wav';
    downloadAudioBlob(blob, `speech.${extension}`);
  } catch (error: any) {
    // If recording fails, show user-friendly message
    throw new Error('Audio recording is not directly supported by the browser. Please use browser recording tools or check the console for more details.');
  }
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getCharacterCount = (text: string): number => {
  return text.length;
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const estimateSpeechTime = (text: string, rate: number): number => {
  const wordsPerMinute = rate * 150; // Average speaking rate
  const wordCount = getWordCount(text);
  return (wordCount / wordsPerMinute) * 60;
};

