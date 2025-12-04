import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Clock, Play, Search, Star, Download, X, Filter } from 'lucide-react';
import { HistoryItem } from '../types';
import { useState, useMemo } from 'react';

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const HistoryPanel = ({ history, onLoad, onDelete, onClear, onToggleFavorite }: HistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'length'>('date');

  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(item => item.isFavorite);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.text.toLowerCase().includes(query) ||
        item.settings.voiceName?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      } else {
        return b.text.length - a.text.length;
      }
    });

    return filtered;
  }, [history, searchQuery, showFavoritesOnly, sortBy]);

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tts-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleFavorite = (id: string) => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-strong rounded-2xl p-4 sm:p-6 border border-dark-border/50 relative overflow-hidden"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-accent via-purple-500 to-pink-500 rounded-2xl blur-xl animate-pulse-slow" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mb-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-dark-accent" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold gradient-text">History</h3>
            <motion.span 
              className="text-xs sm:text-sm text-dark-textSecondary px-2 py-1 rounded bg-dark-surface/50"
              animate={{ scale: history.length > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              ({filteredHistory.length}/{history.length})
            </motion.span>
          </motion.div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors px-2 sm:px-3 py-1 rounded border border-blue-400/30 hover:bg-blue-400/10 whitespace-nowrap flex items-center gap-1"
                  title="Export history"
                >
                  <Download className="w-3 h-3" />
                  Export
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClear}
                  className="text-xs sm:text-sm text-red-400 hover:text-red-300 transition-colors px-2 sm:px-3 py-1 rounded border border-red-400/30 hover:bg-red-400/10 whitespace-nowrap"
                >
                  Clear All
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        {history.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-textSecondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full glass border border-dark-border/50 rounded-lg pl-10 pr-10 py-2 text-sm text-dark-text placeholder-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-textSecondary hover:text-dark-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  showFavoritesOnly
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-dark-surface/50 text-dark-textSecondary border border-dark-border/50 hover:border-yellow-500/50'
                }`}
              >
                <Star className={`w-3 h-3 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites
              </motion.button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'length')}
                className="flex-1 glass border border-dark-border/50 rounded-lg px-3 py-1.5 text-xs text-dark-text bg-dark-surface/50 focus:outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="length">Sort by Length</option>
              </select>
            </div>
          </div>
        )}

      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-dark-textSecondary"
            >
              {history.length === 0
                ? 'No history yet. Your generated speech will appear here.'
                : searchQuery || showFavoritesOnly
                ? 'No items match your filters.'
                : 'No history yet.'}
            </motion.div>
          ) : (
            filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass border border-dark-border/50 hover:border-dark-accent/50 rounded-lg p-4 transition-all group cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-text line-clamp-2 mb-2">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-textSecondary">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.timestamp)}
                      </div>
                      <span>
                        {item.settings.voiceName || 'Default Voice'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onToggleFavorite && (
                      <button
                        onClick={() => handleToggleFavorite(item.id)}
                        className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                          item.isFavorite
                            ? 'opacity-100 text-yellow-400 hover:text-yellow-300'
                            : 'hover:bg-dark-border text-dark-textSecondary hover:text-yellow-400'
                        }`}
                        title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    <button
                      onClick={() => onLoad(item)}
                      className="p-2 hover:bg-dark-border rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Load"
                    >
                      <Play className="w-4 h-4 text-dark-text" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 hover:bg-dark-border rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  );
};

