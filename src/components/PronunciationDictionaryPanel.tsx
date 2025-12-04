// Pronunciation dictionary panel

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Search, Download, Upload } from 'lucide-react';
import { useState, useMemo } from 'react';
import { pronunciationDict, PronunciationEntry } from '../utils/pronunciationDictionary';

export const PronunciationDictionaryPanel = () => {
  const [entries, setEntries] = useState<PronunciationEntry[]>(pronunciationDict.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ word: '', pronunciation: '', language: '' });

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(e =>
      e.word.toLowerCase().includes(query) ||
      e.pronunciation.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

  const handleAdd = () => {
    if (newEntry.word.trim() && newEntry.pronunciation.trim()) {
      pronunciationDict.add({
        word: newEntry.word.trim(),
        pronunciation: newEntry.pronunciation.trim(),
        language: newEntry.language.trim() || undefined
      });
      setEntries(pronunciationDict.getAll());
      setNewEntry({ word: '', pronunciation: '', language: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (word: string, language?: string) => {
    pronunciationDict.remove(word, language);
    setEntries(pronunciationDict.getAll());
  };

  const handleExport = () => {
    const data = pronunciationDict.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pronunciation-dictionary-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          pronunciationDict.import(event.target?.result as string);
          setEntries(pronunciationDict.getAll());
          alert('Dictionary imported successfully!');
        } catch (error) {
          alert('Failed to import dictionary. Invalid format.');
        }
      };
      reader.readAsText(file);
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
          <BookOpen className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-dark-text">Pronunciation Dictionary</h3>
        </div>
        <div className="flex items-center gap-2">
          <label className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 cursor-pointer">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-dark-surface/50 border border-dark-border/30 space-y-2"
          >
            <input
              type="text"
              value={newEntry.word}
              onChange={(e) => setNewEntry({ ...newEntry, word: e.target.value })}
              placeholder="Word (e.g., Sri Lanka)"
              className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text"
            />
            <input
              type="text"
              value={newEntry.pronunciation}
              onChange={(e) => setNewEntry({ ...newEntry, pronunciation: e.target.value })}
              placeholder="Pronunciation (e.g., Shree Lanka)"
              className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text"
            />
            <input
              type="text"
              value={newEntry.language}
              onChange={(e) => setNewEntry({ ...newEntry, language: e.target.value })}
              placeholder="Language (optional, e.g., si)"
              className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text"
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                className="flex-1 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
              >
                Add
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAddForm(false);
                  setNewEntry({ word: '', pronunciation: '', language: '' });
                }}
                className="px-3 py-2 rounded-lg bg-dark-surface hover:bg-dark-hover text-dark-text text-sm"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-textSecondary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dictionary..."
          className="w-full glass border border-dark-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-dark-text placeholder-dark-textSecondary"
        />
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-dark-textSecondary">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No entries found</p>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <motion.div
              key={`${entry.word}-${entry.language || 'default'}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 flex items-center justify-between group"
            >
              <div className="flex-1">
                <div className="font-semibold text-dark-text">{entry.word}</div>
                <div className="text-sm text-dark-textSecondary">→ {entry.pronunciation}</div>
                {entry.language && (
                  <span className="text-xs text-blue-400 mt-1 inline-block">{entry.language}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(entry.word, entry.language)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

