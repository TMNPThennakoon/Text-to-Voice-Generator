// Smart text chunking - Split and preview chunks

import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Play, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import { TextChunk } from '../types';

interface TextChunkingPanelProps {
  text: string;
  onChunkSelect?: (chunk: TextChunk) => void;
}

export const TextChunkingPanel = ({ text, onChunkSelect }: TextChunkingPanelProps) => {
  const [chunkMethod, setChunkMethod] = useState<'sentence' | 'paragraph' | 'custom'>('sentence');
  const [maxLength, setMaxLength] = useState(200);
  const [customDelimiter, setCustomDelimiter] = useState('\n\n');

  const chunks = useMemo(() => {
    if (!text.trim()) return [];

    let splitText: string[] = [];

    switch (chunkMethod) {
      case 'sentence':
        splitText = text.split(/([.!?]+\s+)/).filter(s => s.trim());
        break;
      case 'paragraph':
        splitText = text.split(/\n\s*\n/).filter(s => s.trim());
        break;
      case 'custom':
        splitText = text.split(customDelimiter).filter(s => s.trim());
        break;
    }

    // Merge small chunks or split large ones
    const result: TextChunk[] = [];
    let currentChunk = '';
    let startIndex = 0;

    splitText.forEach((segment, index) => {
      const segmentWithDelimiter = chunkMethod === 'sentence' && index < splitText.length - 1
        ? segment + (splitText[index + 1]?.match(/^[.!?]+\s+/) ? '' : '')
        : segment;

      if ((currentChunk + segmentWithDelimiter).length <= maxLength) {
        currentChunk += segmentWithDelimiter;
      } else {
        if (currentChunk) {
          result.push({
            id: result.length.toString(),
            text: currentChunk.trim(),
            startIndex,
            endIndex: startIndex + currentChunk.length
          });
          startIndex += currentChunk.length;
        }
        currentChunk = segmentWithDelimiter;
      }
    });

    if (currentChunk) {
      result.push({
        id: result.length.toString(),
        text: currentChunk.trim(),
        startIndex,
        endIndex: startIndex + currentChunk.length
      });
    }

    return result;
  }, [text, chunkMethod, maxLength, customDelimiter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <Scissors className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-dark-text">Text Chunking</h3>
        <span className="text-sm text-dark-textSecondary">({chunks.length} chunks)</span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-sm text-dark-textSecondary mb-2 block">Chunk Method</label>
          <div className="flex gap-2">
            {['sentence', 'paragraph', 'custom'].map((method) => (
              <motion.button
                key={method}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setChunkMethod(method as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  chunkMethod === method
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-surface/50 text-dark-textSecondary hover:bg-dark-surface'
                }`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-dark-textSecondary mb-2 block">
            Max Length: {maxLength} characters
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={maxLength}
            onChange={(e) => setMaxLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {chunkMethod === 'custom' && (
          <div>
            <label className="text-sm text-dark-textSecondary mb-2 block">Custom Delimiter</label>
            <input
              type="text"
              value={customDelimiter}
              onChange={(e) => setCustomDelimiter(e.target.value)}
              placeholder="Enter delimiter (e.g., \n\n)"
              className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {chunks.map((chunk, index) => (
            <motion.div
              key={chunk.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-400">Chunk {index + 1}</span>
                <span className="text-xs text-dark-textSecondary">{chunk.text.length} chars</span>
              </div>
              <p className="text-sm text-dark-text line-clamp-3 mb-2">{chunk.text}</p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onChunkSelect?.(chunk)}
                  className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Use
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

