// Text formatting tools panel

import { motion } from 'framer-motion';
import { Wand2, Type, Hash, AlignLeft, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  cleanText,
  capitalizeSentences,
  numberToWords,
  numberToSinhala,
  replaceNumbersInText,
  removeExtraSpaces,
  removeLineBreaks,
  addLineBreaks,
  getTextStats,
} from '../utils/textFormatter';

interface TextFormattingPanelProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const TextFormattingPanel = ({ text, onTextChange }: TextFormattingPanelProps) => {
  const [showStats, setShowStats] = useState(false);
  const stats = getTextStats(text);

  const formatActions = [
    {
      id: 'clean',
      name: 'Clean Text',
      icon: Wand2,
      action: () => onTextChange(cleanText(text)),
      description: 'Remove extra spaces and normalize'
    },
    {
      id: 'capitalize',
      name: 'Capitalize Sentences',
      icon: Type,
      action: () => onTextChange(capitalizeSentences(text)),
      description: 'Capitalize first letter of each sentence'
    },
    {
      id: 'numbers-english',
      name: 'Numbers to Words (EN)',
      icon: Hash,
      action: () => onTextChange(replaceNumbersInText(text, false)),
      description: 'Convert numbers to English words'
    },
    {
      id: 'numbers-sinhala',
      name: 'Numbers to Words (SI)',
      icon: Hash,
      action: () => onTextChange(replaceNumbersInText(text, true)),
      description: 'Convert numbers to Sinhala words'
    },
    {
      id: 'remove-spaces',
      name: 'Remove Extra Spaces',
      icon: AlignLeft,
      action: () => onTextChange(removeExtraSpaces(text)),
      description: 'Remove multiple spaces'
    },
    {
      id: 'remove-breaks',
      name: 'Remove Line Breaks',
      icon: FileText,
      action: () => onTextChange(removeLineBreaks(text)),
      description: 'Remove all line breaks'
    },
    {
      id: 'add-breaks',
      name: 'Add Line Breaks',
      icon: FileText,
      action: () => onTextChange(addLineBreaks(text, 80)),
      description: 'Add line breaks at 80 characters'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-dark-text">Text Formatting</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStats(!showStats)}
          className="px-3 py-1.5 rounded-lg bg-dark-surface/50 text-sm text-dark-textSecondary hover:text-dark-text"
        >
          {showStats ? 'Hide' : 'Show'} Stats
        </motion.button>
      </div>

      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 rounded-lg bg-dark-surface/50 border border-dark-border/30"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-dark-textSecondary">Characters</div>
              <div className="text-lg font-semibold text-dark-text">{stats.characters}</div>
            </div>
            <div>
              <div className="text-dark-textSecondary">Words</div>
              <div className="text-lg font-semibold text-dark-text">{stats.words}</div>
            </div>
            <div>
              <div className="text-dark-textSecondary">Sentences</div>
              <div className="text-lg font-semibold text-dark-text">{stats.sentences}</div>
            </div>
            <div>
              <div className="text-dark-textSecondary">Reading Time</div>
              <div className="text-lg font-semibold text-dark-text">{stats.readingTime}m</div>
            </div>
          </div>
          {stats.topWords.length > 0 && (
            <div className="mt-3 pt-3 border-t border-dark-border/30">
              <div className="text-xs text-dark-textSecondary mb-2">Top Words:</div>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.slice(0, 5).map(({ word, count }) => (
                  <span
                    key={word}
                    className="px-2 py-1 rounded bg-dark-accent/20 text-xs text-dark-text"
                  >
                    {word} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {formatActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 hover:bg-dark-surface/50 transition-all flex flex-col items-center gap-2"
              title={action.description}
            >
              <Icon className="w-5 h-5 text-dark-accent" />
              <span className="text-xs font-medium text-dark-text text-center">
                {action.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

