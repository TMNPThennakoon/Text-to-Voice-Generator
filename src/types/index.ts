export interface VoiceSettings {
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

export interface SerializedVoiceSettings {
  voiceName: string | null;
  voiceLang: string | null;
  rate: number;
  pitch: number;
  volume: number;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  settings: SerializedVoiceSettings;
  isFavorite?: boolean;
  tags?: string[];
  audioUrl?: string;
}

export interface AppState {
  text: string;
  isPlaying: boolean;
  isPaused: boolean;
  currentUtterance: SpeechSynthesisUtterance | null;
  availableVoices: SpeechSynthesisVoice[];
  settings: VoiceSettings;
  history: HistoryItem[];
}

// New feature types
export interface VoiceProfile {
  id: string;
  name: string;
  settings: VoiceSettings;
  createdAt: number;
}

export interface TextTemplate {
  id: string;
  name: string;
  text: string;
  language: string;
  category: string;
}

export interface EmotionPreset {
  id: string;
  name: string;
  icon: string;
  pitch: number;
  rate: number;
  volume: number;
  description: string;
}

export interface PronunciationEntry {
  word: string;
  pronunciation: string;
  language?: string;
}

export interface TextChunk {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  settings?: Partial<VoiceSettings>;
}

export interface VoiceComparison {
  id: string;
  text: string;
  voices: Array<{
    voice: SpeechSynthesisVoice;
    settings: VoiceSettings;
  }>;
}

export interface UsageStats {
  totalCharacters: number;
  totalGenerations: number;
  mostUsedVoices: Array<{ voiceName: string; count: number }>;
  languageDistribution: Array<{ language: string; count: number }>;
  totalTimeSaved: number; // in seconds
}

export interface WorkspaceTab {
  id: string;
  name: string;
  text: string;
  settings: VoiceSettings;
  isActive: boolean;
}

export interface AudioEffect {
  type: 'echo' | 'reverb' | 'fadeIn' | 'fadeOut' | 'normalize';
  intensity?: number;
  duration?: number;
}

