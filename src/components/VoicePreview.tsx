// Voice preview component - quick test with sample text

import { motion } from 'framer-motion';
import { Play, Volume2, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VoiceSettings } from '../types';

interface VoicePreviewProps {
  voice: SpeechSynthesisVoice | null;
  settings: VoiceSettings;
  onClose?: () => void;
}

const sampleTexts = [
  'Hello, this is a voice preview. How does this voice sound to you?',
  'The quick brown fox jumps over the lazy dog.',
  'Welcome to our text to speech platform.',
  'සාදරයෙන් පිළිගනිමු. මෙය ශබ්ද පරීක්ෂාවකි.',
];

export const VoicePreview = ({ voice, settings, onClose }: VoicePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedText, setSelectedText] = useState(sampleTexts[0]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePreview = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!voice || !selectedText.trim()) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(selectedText);
    utterance.voice = voice;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-dark-accent" />
          <h3 className="text-lg font-semibold text-dark-text">Voice Preview</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-dark-textSecondary" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <select
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text bg-dark-surface/50 focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        >
          {sampleTexts.map((text, index) => (
            <option key={index} value={text}>
              {text.length > 50 ? text.substring(0, 50) + '...' : text}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePreview}
          disabled={!voice}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Play className={`w-4 h-4 ${isPlaying ? 'hidden' : ''}`} />
          {isPlaying ? 'Stop Preview' : 'Preview Voice'}
        </motion.button>

        {voice && (
          <p className="text-xs text-dark-textSecondary text-center">
            Testing: {voice.name} ({voice.lang})
          </p>
        )}
      </div>
    </motion.div>
  );
};

