// Voice profiles management

import { VoiceProfile, VoiceSettings } from '../types';

class VoiceProfileManager {
  private profiles: VoiceProfile[] = [];

  constructor() {
    this.loadFromStorage();
  }

  getAll(): VoiceProfile[] {
    return [...this.profiles];
  }

  get(id: string): VoiceProfile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  create(name: string, settings: VoiceSettings): VoiceProfile {
    const profile: VoiceProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      settings,
      createdAt: Date.now()
    };
    this.profiles.push(profile);
    this.saveToStorage();
    return profile;
  }

  update(id: string, updates: Partial<VoiceProfile>): void {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...updates };
      this.saveToStorage();
    }
  }

  delete(id: string): void {
    this.profiles = this.profiles.filter(p => p.id !== id);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('voice-profiles', JSON.stringify(this.profiles));
    } catch (error) {
      console.error('Failed to save voice profiles:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('voice-profiles');
      if (stored) {
        this.profiles = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load voice profiles:', error);
      this.profiles = [];
    }
  }

  export(): string {
    return JSON.stringify(this.profiles, null, 2);
  }

  import(json: string): void {
    try {
      const profiles: VoiceProfile[] = JSON.parse(json);
      profiles.forEach(profile => {
        if (!this.profiles.find(p => p.id === profile.id)) {
          this.profiles.push(profile);
        }
      });
      this.saveToStorage();
    } catch (error) {
      throw new Error('Invalid voice profile format');
    }
  }
}

export const voiceProfileManager = new VoiceProfileManager();

