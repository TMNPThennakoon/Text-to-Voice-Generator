// Workspace mode - Multiple text tabs

import { useState, useEffect } from 'react';
import { WorkspaceTab, VoiceSettings } from '../types';

function createNewTab(index: number = 1): WorkspaceTab {
  return {
    id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `Tab ${index}`,
    text: '',
    settings: {
      voice: null,
      rate: 1,
      pitch: 1,
      volume: 1
    },
    isActive: false
  };
}

export function useWorkspace() {
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    const saved = localStorage.getItem('workspace-tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fall through to default
      }
    }
    return [createNewTab(1)];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id || '');

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('workspace-tabs', JSON.stringify(tabs));
      if (!activeTabId && tabs[0]) {
        setActiveTabId(tabs[0].id);
      }
    }
  }, [tabs, activeTabId]);

  const addTab = () => {
    const newTab = createNewTab(tabs.length + 1);
    setTabs(prev => prev.map(t => ({ ...t, isActive: false })).concat({ ...newTab, isActive: true }));
    setActiveTabId(newTab.id);
  };

  const removeTab = (id: string) => {
    if (tabs.length <= 1) return; // Keep at least one tab
    const newTabs = tabs.filter(t => t.id !== id);
    if (id === activeTabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
      newTabs[0].isActive = true;
    }
    setTabs(newTabs);
  };

  const updateTab = (id: string, updates: Partial<WorkspaceTab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const setActiveTab = (id: string) => {
    setActiveTabId(id);
    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
  };

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return {
    tabs,
    activeTab,
    activeTabId,
    addTab,
    removeTab,
    updateTab,
    setActiveTab
  };
}

