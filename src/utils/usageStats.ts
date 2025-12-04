// Usage statistics tracking

import { HistoryItem } from '../types';

export interface UsageStats {
  totalCharacters: number;
  totalGenerations: number;
  mostUsedVoices: Array<{ voiceName: string; count: number }>;
  languageDistribution: Array<{ language: string; count: number }>;
  totalTimeSaved: number; // in seconds
  averageTextLength: number;
  favoriteVoices: Array<{ voiceName: string; count: number }>;
}

class UsageStatsManager {
  private stats: UsageStats = {
    totalCharacters: 0,
    totalGenerations: 0,
    mostUsedVoices: [],
    languageDistribution: [],
    totalTimeSaved: 0,
    averageTextLength: 0,
    favoriteVoices: []
  };

  constructor() {
    this.loadStats();
  }

  updateFromHistory(history: HistoryItem[]) {
    this.stats.totalGenerations = history.length;
    this.stats.totalCharacters = history.reduce((sum, item) => sum + item.text.length, 0);
    this.stats.averageTextLength = this.stats.totalGenerations > 0
      ? this.stats.totalCharacters / this.stats.totalGenerations
      : 0;

    // Calculate most used voices
    const voiceCounts: Record<string, number> = {};
    history.forEach(item => {
      const voiceName = item.settings.voiceName || 'Default';
      voiceCounts[voiceName] = (voiceCounts[voiceName] || 0) + 1;
    });
    this.stats.mostUsedVoices = Object.entries(voiceCounts)
      .map(([voiceName, count]) => ({ voiceName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate language distribution (from voice lang)
    const langCounts: Record<string, number> = {};
    history.forEach(item => {
      const lang = item.settings.voiceLang?.split('-')[0] || 'unknown';
      langCounts[lang] = (langCounts[lang] || 0) + 1;
    });
    this.stats.languageDistribution = Object.entries(langCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate time saved (assuming average reading speed of 200 words/min)
    const totalWords = history.reduce((sum, item) => {
      return sum + item.text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
    this.stats.totalTimeSaved = Math.round((totalWords / 200) * 60); // in seconds

    // Favorite voices (from favorite items)
    const favoriteVoiceCounts: Record<string, number> = {};
    history.filter(item => item.isFavorite).forEach(item => {
      const voiceName = item.settings.voiceName || 'Default';
      favoriteVoiceCounts[voiceName] = (favoriteVoiceCounts[voiceName] || 0) + 1;
    });
    this.stats.favoriteVoices = Object.entries(favoriteVoiceCounts)
      .map(([voiceName, count]) => ({ voiceName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    this.saveStats();
  }

  getStats(): UsageStats {
    return { ...this.stats };
  }

  reset() {
    this.stats = {
      totalCharacters: 0,
      totalGenerations: 0,
      mostUsedVoices: [],
      languageDistribution: [],
      totalTimeSaved: 0,
      averageTextLength: 0,
      favoriteVoices: []
    };
    this.saveStats();
  }

  private saveStats() {
    try {
      localStorage.setItem('usage-stats', JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save usage stats:', error);
    }
  }

  private loadStats() {
    try {
      const saved = localStorage.getItem('usage-stats');
      if (saved) {
        this.stats = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  }
}

export const usageStatsManager = new UsageStatsManager();

