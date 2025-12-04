// Pronunciation dictionary for custom word pronunciations

export interface PronunciationEntry {
  word: string;
  pronunciation: string;
  language?: string;
}

class PronunciationDictionary {
  private entries: Map<string, PronunciationEntry> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  add(entry: PronunciationEntry): void {
    const key = this.getKey(entry.word, entry.language);
    this.entries.set(key, entry);
    this.saveToStorage();
  }

  remove(word: string, language?: string): void {
    const key = this.getKey(word, language);
    this.entries.delete(key);
    this.saveToStorage();
  }

  get(word: string, language?: string): PronunciationEntry | undefined {
    const key = this.getKey(word, language);
    return this.entries.get(key);
  }

  getAll(): PronunciationEntry[] {
    return Array.from(this.entries.values());
  }

  applyToText(text: string, language?: string): string {
    let result = text;
    this.entries.forEach(entry => {
      if (!entry.language || entry.language === language) {
        const regex = new RegExp(`\\b${this.escapeRegex(entry.word)}\\b`, 'gi');
        result = result.replace(regex, entry.pronunciation);
      }
    });
    return result;
  }

  private getKey(word: string, language?: string): string {
    return `${word.toLowerCase()}_${language || 'default'}`;
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private saveToStorage(): void {
    try {
      const entries = Array.from(this.entries.values());
      localStorage.setItem('pronunciation-dictionary', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save pronunciation dictionary:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('pronunciation-dictionary');
      if (stored) {
        const entries: PronunciationEntry[] = JSON.parse(stored);
        entries.forEach(entry => {
          const key = this.getKey(entry.word, entry.language);
          this.entries.set(key, entry);
        });
      }
    } catch (error) {
      console.error('Failed to load pronunciation dictionary:', error);
    }
  }

  export(): string {
    return JSON.stringify(Array.from(this.entries.values()), null, 2);
  }

  import(json: string): void {
    try {
      const entries: PronunciationEntry[] = JSON.parse(json);
      entries.forEach(entry => this.add(entry));
    } catch (error) {
      throw new Error('Invalid pronunciation dictionary format');
    }
  }

  clear(): void {
    this.entries.clear();
    localStorage.removeItem('pronunciation-dictionary');
  }
}

export const pronunciationDict = new PronunciationDictionary();

