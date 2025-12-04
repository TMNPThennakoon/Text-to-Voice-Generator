// Multiple voice selection - Dialogue mode

import { motion } from 'framer-motion';
import { Users, Plus, X, Play } from 'lucide-react';
import { useState } from 'react';
import { VoiceSettings, SpeechSynthesisVoice } from '../types';

interface DialogueSpeaker {
  id: string;
  name: string;
  voice: SpeechSynthesisVoice | null;
  settings: VoiceSettings;
  text: string;
}

interface DialogueModeProps {
  availableVoices: SpeechSynthesisVoice[];
  onPlay: (speakers: DialogueSpeaker[]) => void;
}

export const DialogueMode = ({ availableVoices, onPlay }: DialogueModeProps) => {
  const [speakers, setSpeakers] = useState<DialogueSpeaker[]>([
    {
      id: '1',
      name: 'Speaker 1',
      voice: null,
      settings: { voice: null, rate: 1, pitch: 1, volume: 1 },
      text: ''
    }
  ]);

  const addSpeaker = () => {
    setSpeakers([...speakers, {
      id: Date.now().toString(),
      name: `Speaker ${speakers.length + 1}`,
      voice: null,
      settings: { voice: null, rate: 1, pitch: 1, volume: 1 },
      text: ''
    }]);
  };

  const removeSpeaker = (id: string) => {
    if (speakers.length > 1) {
      setSpeakers(speakers.filter(s => s.id !== id));
    }
  };

  const updateSpeaker = (id: string, updates: Partial<DialogueSpeaker>) => {
    setSpeakers(speakers.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handlePlay = () => {
    const activeSpeakers = speakers.filter(s => s.text.trim() && s.voice);
    if (activeSpeakers.length > 0) {
      onPlay(activeSpeakers);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-dark-text">Dialogue Mode</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addSpeaker}
            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            disabled={speakers.filter(s => s.text.trim() && s.voice).length === 0}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            <Play className="w-4 h-4 inline mr-1" />
            Play All
          </motion.button>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
        {speakers.map((speaker, index) => (
          <motion.div
            key={speaker.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-lg border border-dark-border/50 bg-dark-surface/30"
          >
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={speaker.name}
                onChange={(e) => updateSpeaker(speaker.id, { name: e.target.value })}
                className="font-semibold text-dark-text bg-transparent border-none outline-none flex-1"
                placeholder="Speaker name"
              />
              {speakers.length > 1 && (
                <button
                  onClick={() => removeSpeaker(speaker.id)}
                  className="p-1 hover:bg-red-500/20 rounded text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <select
                value={speaker.voice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value);
                  updateSpeaker(speaker.id, {
                    voice: voice || null,
                    settings: { ...speaker.settings, voice: voice || null }
                  });
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

              <textarea
                value={speaker.text}
                onChange={(e) => updateSpeaker(speaker.id, { text: e.target.value })}
                placeholder={`Enter ${speaker.name}'s dialogue...`}
                className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text bg-dark-surface/50 min-h-[80px] resize-none"
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-dark-textSecondary">Rate</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speaker.settings.rate}
                    onChange={(e) => updateSpeaker(speaker.id, {
                      settings: { ...speaker.settings, rate: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-dark-textSecondary">{speaker.settings.rate.toFixed(1)}x</span>
                </div>
                <div>
                  <label className="text-xs text-dark-textSecondary">Pitch</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speaker.settings.pitch}
                    onChange={(e) => updateSpeaker(speaker.id, {
                      settings: { ...speaker.settings, pitch: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-dark-textSecondary">{speaker.settings.pitch.toFixed(1)}</span>
                </div>
                <div>
                  <label className="text-xs text-dark-textSecondary">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={speaker.settings.volume}
                    onChange={(e) => updateSpeaker(speaker.id, {
                      settings: { ...speaker.settings, volume: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-dark-textSecondary">{Math.round(speaker.settings.volume * 100)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

