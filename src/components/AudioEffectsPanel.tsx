// Audio effects panel

import { motion } from 'framer-motion';
import { Sparkles, Play, Download } from 'lucide-react';
import { useState } from 'react';
import { applyEcho, applyReverb, applyFadeIn, applyFadeOut, normalizeAudio } from '../utils/audioEffects';

interface AudioEffectsPanelProps {
  audioBuffer: AudioBuffer | null;
  onProcessed: (buffer: AudioBuffer) => void;
}

export const AudioEffectsPanel = ({ audioBuffer, onProcessed }: AudioEffectsPanelProps) => {
  const [processing, setProcessing] = useState(false);
  const [currentBuffer, setCurrentBuffer] = useState<AudioBuffer | null>(audioBuffer);

  const effects = [
    {
      id: 'echo',
      name: 'Echo',
      icon: '🔊',
      apply: async () => {
        if (!currentBuffer) return;
        setProcessing(true);
        try {
          const processed = await applyEcho(currentBuffer, 0.3, 0.3);
          setCurrentBuffer(processed);
          onProcessed(processed);
        } catch (error) {
          console.error('Echo effect failed:', error);
        } finally {
          setProcessing(false);
        }
      }
    },
    {
      id: 'reverb',
      name: 'Reverb',
      icon: '🏛️',
      apply: async () => {
        if (!currentBuffer) return;
        setProcessing(true);
        try {
          const processed = await applyReverb(currentBuffer, 0.5);
          setCurrentBuffer(processed);
          onProcessed(processed);
        } catch (error) {
          console.error('Reverb effect failed:', error);
        } finally {
          setProcessing(false);
        }
      }
    },
    {
      id: 'fadeIn',
      name: 'Fade In',
      icon: '⬆️',
      apply: async () => {
        if (!currentBuffer) return;
        setProcessing(true);
        try {
          const processed = await applyFadeIn(currentBuffer, 0.5);
          setCurrentBuffer(processed);
          onProcessed(processed);
        } catch (error) {
          console.error('Fade in failed:', error);
        } finally {
          setProcessing(false);
        }
      }
    },
    {
      id: 'fadeOut',
      name: 'Fade Out',
      icon: '⬇️',
      apply: async () => {
        if (!currentBuffer) return;
        setProcessing(true);
        try {
          const processed = await applyFadeOut(currentBuffer, 0.5);
          setCurrentBuffer(processed);
          onProcessed(processed);
        } catch (error) {
          console.error('Fade out failed:', error);
        } finally {
          setProcessing(false);
        }
      }
    },
    {
      id: 'normalize',
      name: 'Normalize',
      icon: '📊',
      apply: async () => {
        if (!currentBuffer) return;
        setProcessing(true);
        try {
          const processed = await normalizeAudio(currentBuffer);
          setCurrentBuffer(processed);
          onProcessed(processed);
        } catch (error) {
          console.error('Normalize failed:', error);
        } finally {
          setProcessing(false);
        }
      }
    },
  ];

  if (!audioBuffer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-strong rounded-xl p-6 border border-dark-border/50 text-center"
      >
        <p className="text-dark-textSecondary">Generate audio first to apply effects</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-dark-text">Audio Effects</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {effects.map((effect) => (
          <motion.button
            key={effect.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={effect.apply}
            disabled={processing}
            className="p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 hover:bg-dark-surface/50 transition-all flex flex-col items-center gap-2 disabled:opacity-50"
          >
            <span className="text-2xl">{effect.icon}</span>
            <span className="text-xs font-medium text-dark-text">{effect.name}</span>
          </motion.button>
        ))}
      </div>

      {processing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-dark-textSecondary"
        >
          Processing audio...
        </motion.div>
      )}
    </motion.div>
  );
};

