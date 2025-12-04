// Emotion and tone presets

import { EmotionPreset } from '../types';

export const emotionPresets: EmotionPreset[] = [
  {
    id: 'happy',
    name: 'Happy',
    icon: '😊',
    pitch: 1.2,
    rate: 1.1,
    volume: 1.0,
    description: 'Cheerful and upbeat voice'
  },
  {
    id: 'sad',
    name: 'Sad',
    icon: '😢',
    pitch: 0.8,
    rate: 0.8,
    volume: 0.9,
    description: 'Melancholic and slow voice'
  },
  {
    id: 'excited',
    name: 'Excited',
    icon: '🎉',
    pitch: 1.4,
    rate: 1.5,
    volume: 1.0,
    description: 'Energetic and fast voice'
  },
  {
    id: 'calm',
    name: 'Calm',
    icon: '🧘',
    pitch: 1.0,
    rate: 0.9,
    volume: 0.8,
    description: 'Peaceful and soothing voice'
  },
  {
    id: 'angry',
    name: 'Angry',
    icon: '😠',
    pitch: 0.7,
    rate: 1.2,
    volume: 1.0,
    description: 'Intense and forceful voice'
  },
  {
    id: 'whisper',
    name: 'Whisper',
    icon: '🤫',
    pitch: 0.9,
    rate: 0.7,
    volume: 0.5,
    description: 'Soft and quiet voice'
  },
  {
    id: 'confident',
    name: 'Confident',
    icon: '💪',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    description: 'Strong and assertive voice'
  },
  {
    id: 'friendly',
    name: 'Friendly',
    icon: '👋',
    pitch: 1.1,
    rate: 1.0,
    volume: 0.9,
    description: 'Warm and welcoming voice'
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: '💼',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    description: 'Clear and formal voice'
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    icon: '🎭',
    pitch: 0.9,
    rate: 0.9,
    volume: 1.0,
    description: 'Expressive and theatrical voice'
  }
];

export function getEmotionPreset(id: string): EmotionPreset | undefined {
  return emotionPresets.find(p => p.id === id);
}

export function getAllEmotionPresets(): EmotionPreset[] {
  return [...emotionPresets];
}

