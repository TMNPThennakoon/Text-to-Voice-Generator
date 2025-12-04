// Text templates library

import { TextTemplate } from '../types';

export const defaultTemplates: TextTemplate[] = [
  // English Templates
  {
    id: 'en-greeting-1',
    name: 'Welcome Greeting',
    text: 'Welcome to our platform. We are delighted to have you here.',
    language: 'en',
    category: 'Greetings'
  },
  {
    id: 'en-greeting-2',
    name: 'Thank You Message',
    text: 'Thank you for using our service. We appreciate your support.',
    language: 'en',
    category: 'Greetings'
  },
  {
    id: 'en-announcement-1',
    name: 'General Announcement',
    text: 'Attention please. This is an important announcement. Please listen carefully.',
    language: 'en',
    category: 'Announcements'
  },
  {
    id: 'en-story-1',
    name: 'Short Story Opening',
    text: 'Once upon a time, in a land far away, there lived a wise old man who had a secret that would change everything.',
    language: 'en',
    category: 'Stories'
  },
  
  // Sinhala Templates
  {
    id: 'si-greeting-1',
    name: 'සාදරයෙන් පිළිගනිමු',
    text: 'අපගේ වේදිකාවට සාදරයෙන් පිළිගනිමු. ඔබව මෙහි දැකීමට අපි සතුටු වෙමු.',
    language: 'si',
    category: 'Greetings'
  },
  {
    id: 'si-greeting-2',
    name: 'ස්තුතියි',
    text: 'අපගේ සේවාව භාවිතා කිරීමට ස්තුතියි. ඔබගේ සහාය අපි අගය කරමු.',
    language: 'si',
    category: 'Greetings'
  },
  {
    id: 'si-announcement-1',
    name: 'සාමාන්‍ය නිවේදනය',
    text: 'කරුණාකර අවධානය යොමු කරන්න. මෙය වැදගත් නිවේදනයකි. කරුණාකර ප්‍රවේශමෙන් සවන් දෙන්න.',
    language: 'si',
    category: 'Announcements'
  },
  {
    id: 'si-story-1',
    name: 'කෙටි කතාවක ආරම්භය',
    text: 'කලකට පෙර, ඈත රටක, ජීවත් වූ ඥානවන්ත වයස්ගත මිනිසෙක් සිටියේය. ඔහුට රහසක් තිබුණි.',
    language: 'si',
    category: 'Stories'
  },
  
  // Business Templates
  {
    id: 'en-business-1',
    name: 'Business Meeting Opening',
    text: 'Good morning everyone. Thank you for joining today\'s meeting. Let\'s begin with the agenda.',
    language: 'en',
    category: 'Business'
  },
  {
    id: 'en-business-2',
    name: 'Customer Service',
    text: 'Hello, thank you for contacting us. How may I assist you today?',
    language: 'en',
    category: 'Business'
  },
  
  // Educational Templates
  {
    id: 'en-education-1',
    name: 'Lesson Introduction',
    text: 'Today we will learn about an important topic. Please pay attention and take notes.',
    language: 'en',
    category: 'Education'
  },
  
  // Emergency Templates
  {
    id: 'en-emergency-1',
    name: 'Emergency Alert',
    text: 'This is an emergency announcement. Please remain calm and follow instructions.',
    language: 'en',
    category: 'Emergency'
  }
];

class TemplateManager {
  private templates: TextTemplate[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.templates.length === 0) {
      this.templates = [...defaultTemplates];
      this.saveToStorage();
    }
  }

  getAll(): TextTemplate[] {
    return [...this.templates];
  }

  getByCategory(category: string): TextTemplate[] {
    return this.templates.filter(t => t.category === category);
  }

  getByLanguage(language: string): TextTemplate[] {
    return this.templates.filter(t => t.language === language);
  }

  get(id: string): TextTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  add(template: Omit<TextTemplate, 'id'>): TextTemplate {
    const newTemplate: TextTemplate = {
      ...template,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    this.templates.push(newTemplate);
    this.saveToStorage();
    return newTemplate;
  }

  remove(id: string): void {
    this.templates = this.templates.filter(t => t.id !== id);
    this.saveToStorage();
  }

  update(id: string, updates: Partial<TextTemplate>): void {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      this.saveToStorage();
    }
  }

  getCategories(): string[] {
    const categories = new Set(this.templates.map(t => t.category));
    return Array.from(categories).sort();
  }

  private saveToStorage(): void {
    try {
      const customTemplates = this.templates.filter(t => t.id.startsWith('custom-'));
      localStorage.setItem('text-templates', JSON.stringify(customTemplates));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('text-templates');
      if (stored) {
        const customTemplates: TextTemplate[] = JSON.parse(stored);
        this.templates = [...defaultTemplates, ...customTemplates];
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      this.templates = [...defaultTemplates];
    }
  }

  export(): string {
    return JSON.stringify(this.templates, null, 2);
  }

  import(json: string): void {
    try {
      const templates: TextTemplate[] = JSON.parse(json);
      templates.forEach(template => {
        if (!template.id.startsWith('custom-')) {
          this.add(template);
        }
      });
    } catch (error) {
      throw new Error('Invalid template format');
    }
  }
}

export const templateManager = new TemplateManager();

