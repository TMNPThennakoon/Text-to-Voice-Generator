// Emotion presets component

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { emotionPresets, EmotionPreset } from '../utils/emotionPresets';
import { VoiceSettings } from '../types';

interface EmotionPresetsProps {
  onSelect: (preset: EmotionPreset) => void;
  currentSettings: VoiceSettings;
}

export const EmotionPresets = ({ onSelect, currentSettings }: EmotionPresetsProps) => {
  const getActivePreset = () => {
    return emotionPresets.find(
      preset =>
        Math.abs(preset.pitch - currentSettings.pitch) < 0.2 &&
        Math.abs(preset.rate - currentSettings.rate) < 0.2
    );
  };

  const activePreset = getActivePreset();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border border-dark-border/50 rounded-xl p-3 sm:p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
        <label className="text-sm sm:text-base font-semibold text-dark-text">
          Emotion & Tone
        </label>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5 sm:gap-2">
        {emotionPresets.map((preset) => {
          const isActive = activePreset?.id === preset.id;
          return (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(preset)}
              className={`p-2 sm:p-3 rounded-lg border transition-all flex flex-col items-center justify-center h-[70px] sm:h-[80px] overflow-hidden ${
                isActive
                  ? 'border-pink-500 bg-pink-500/20 text-pink-400 shadow-lg shadow-pink-500/30'
                  : 'border-dark-border/50 glass text-dark-textSecondary hover:border-pink-500/50'
              }`}
              title={preset.description}
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-1.5 leading-none flex-shrink-0">
                {preset.icon}
              </div>
              <div className="text-[10px] sm:text-xs font-semibold leading-tight text-center w-full px-0.5 sm:px-1 line-clamp-2 overflow-hidden">
                {preset.name}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

