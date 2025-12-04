// Usage statistics dashboard

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Mic, Globe, Star, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usageStatsManager, UsageStats } from '../utils/usageStats';
import { HistoryItem } from '../types';

interface UsageStatisticsProps {
  history: HistoryItem[];
}

export const UsageStatistics = ({ history }: UsageStatisticsProps) => {
  const [stats, setStats] = useState<UsageStats>(usageStatsManager.getStats());

  useEffect(() => {
    usageStatsManager.updateFromHistory(history);
    setStats(usageStatsManager.getStats());
  }, [history]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-dark-text">Usage Statistics</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            usageStatsManager.reset();
            setStats(usageStatsManager.getStats());
          }}
          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
          title="Reset statistics"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-dark-textSecondary">Total Generations</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.totalGenerations}</div>
        </div>

        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-dark-textSecondary">Total Characters</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {stats.totalCharacters.toLocaleString()}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-xs text-dark-textSecondary">Time Saved</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{formatTime(stats.totalTimeSaved)}</div>
        </div>

        <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-dark-textSecondary">Avg Length</span>
          </div>
          <div className="text-2xl font-bold text-pink-400">
            {Math.round(stats.averageTextLength)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mic className="w-4 h-4 text-blue-400" />
            <h4 className="font-semibold text-dark-text">Most Used Voices</h4>
          </div>
          <div className="space-y-2">
            {stats.mostUsedVoices.length === 0 ? (
              <p className="text-sm text-dark-textSecondary">No data yet</p>
            ) : (
              stats.mostUsedVoices.slice(0, 5).map((voice, index) => (
                <div key={voice.voiceName} className="flex items-center justify-between p-2 rounded bg-dark-surface/30">
                  <span className="text-sm text-dark-text">
                    {index + 1}. {voice.voiceName || 'Default'}
                  </span>
                  <span className="text-xs text-dark-textSecondary">{voice.count} times</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-green-400" />
            <h4 className="font-semibold text-dark-text">Language Distribution</h4>
          </div>
          <div className="space-y-2">
            {stats.languageDistribution.length === 0 ? (
              <p className="text-sm text-dark-textSecondary">No data yet</p>
            ) : (
              stats.languageDistribution.slice(0, 5).map((lang) => (
                <div key={lang.language} className="flex items-center justify-between p-2 rounded bg-dark-surface/30">
                  <span className="text-sm text-dark-text uppercase">{lang.language}</span>
                  <span className="text-xs text-dark-textSecondary">{lang.count} times</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {stats.favoriteVoices.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <h4 className="font-semibold text-dark-text">Favorite Voices</h4>
          </div>
          <div className="space-y-2">
            {stats.favoriteVoices.map((voice) => (
              <div key={voice.voiceName} className="flex items-center justify-between p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
                <span className="text-sm text-dark-text">{voice.voiceName || 'Default'}</span>
                <span className="text-xs text-dark-textSecondary">{voice.count} favorites</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

