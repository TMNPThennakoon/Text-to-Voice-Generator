// Voice comparison tool - Side-by-side comparison

import { motion } from 'framer-motion';
import { GitCompare, Play, Pause, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { VoiceSettings, SpeechSynthesisVoice } from '../types';

interface VoiceComparison {
  id: string;
  voice: SpeechSynthesisVoice;
  settings: VoiceSettings;
  name: string;
}

interface VoiceComparisonToolProps {
  text: string;
  availableVoices: SpeechSynthesisVoice[];
  onClose?: () => void;
}

export const VoiceComparisonTool = ({ text, availableVoices, onClose }: VoiceComparisonToolProps) => {
  const [comparisons, setComparisons] = useState<VoiceComparison[]>([
    {
      id: '1',
      voice: availableVoices[0] || null as any,
      settings: { voice: null, rate: 1, pitch: 1, volume: 1 },
      name: 'Voice 1'
    },
    {
      id: '2',
      voice: availableVoices[1] || null as any,
      settings: { voice: null, rate: 1, pitch: 1, volume: 1 },
      name: 'Voice 2'
    }
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const utteranceRefs = useRef<Map<string, SpeechSynthesisUtterance>>(new Map());

  const handlePlay = (id: string) => {
    if (playingId === id) {
      speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    speechSynthesis.cancel();
    setPlayingId(null);

    const comparison = comparisons.find(c => c.id === id);
    if (!comparison || !comparison.voice || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = comparison.voice;
    utterance.rate = comparison.settings.rate;
    utterance.pitch = comparison.settings.pitch;
    utterance.volume = comparison.settings.volume;

    utterance.onstart = () => setPlayingId(id);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    utteranceRefs.current.set(id, utterance);
    speechSynthesis.speak(utterance);
    setPlayingId(id);
  };

  const updateComparison = (id: string, updates: Partial<VoiceComparison>) => {
    setComparisons(comparisons.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-dark-text">Voice Comparison</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-hover rounded-lg"
          >
            <X className="w-4 h-4 text-dark-textSecondary" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisons.map((comparison) => (
          <motion.div
            key={comparison.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border border-dark-border/50 bg-dark-surface/30"
          >
            <input
              type="text"
              value={comparison.name}
              onChange={(e) => updateComparison(comparison.id, { name: e.target.value })}
              className="font-semibold text-dark-text bg-transparent border-none outline-none mb-3 w-full"
            />

            <div className="space-y-3">
              <select
                value={comparison.voice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value);
                  if (voice) {
                    updateComparison(comparison.id, {
                      voice,
                      settings: { ...comparison.settings, voice }
                    });
                  }
                }}
                className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text bg-dark-surface/50"
              >
                <option value="">Select voice...</option>
                {availableVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-dark-textSecondary">Rate</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={comparison.settings.rate}
                    onChange={(e) => updateComparison(comparison.id, {
                      settings: { ...comparison.settings, rate: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-dark-text">{comparison.settings.rate.toFixed(1)}x</span>
                </div>
                <div>
                  <label className="text-dark-textSecondary">Pitch</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={comparison.settings.pitch}
                    onChange={(e) => updateComparison(comparison.id, {
                      settings: { ...comparison.settings, pitch: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-dark-text">{comparison.settings.pitch.toFixed(1)}</span>
                </div>
                <div>
                  <label className="text-dark-textSecondary">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={comparison.settings.volume}
                    onChange={(e) => updateComparison(comparison.id, {
                      settings: { ...comparison.settings, volume: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-dark-text">{Math.round(comparison.settings.volume * 100)}%</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlay(comparison.id)}
                disabled={!comparison.voice || !text.trim()}
                className={`w-full px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  playingId === comparison.id
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } disabled:opacity-50`}
              >
                {playingId === comparison.id ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

