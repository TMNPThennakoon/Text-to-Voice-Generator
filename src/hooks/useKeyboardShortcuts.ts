// Keyboard shortcuts hook

import { useEffect } from 'react';

export interface KeyboardShortcuts {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onDownload?: () => void;
  onTranslate?: () => void;
  onClear?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFocusText?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow some shortcuts even when typing
        if (e.ctrlKey || e.metaKey) {
          // Ctrl/Cmd shortcuts work in inputs
        } else {
          return;
        }
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Play/Pause: Space or Ctrl/Cmd + Enter
      if (e.key === ' ' && !modKey && shortcuts.onPlay && shortcuts.onPause) {
        e.preventDefault();
        // Toggle play/pause
        return;
      }

      if (modKey && e.key === 'Enter' && shortcuts.onPlay) {
        e.preventDefault();
        shortcuts.onPlay();
        return;
      }

      // Stop: Escape
      if (e.key === 'Escape' && shortcuts.onStop) {
        e.preventDefault();
        shortcuts.onStop();
        return;
      }

      // Download: Ctrl/Cmd + S
      if (modKey && e.key === 's' && shortcuts.onDownload) {
        e.preventDefault();
        shortcuts.onDownload();
        return;
      }

      // Translate: Ctrl/Cmd + T
      if (modKey && e.key === 't' && shortcuts.onTranslate) {
        e.preventDefault();
        shortcuts.onTranslate();
        return;
      }

      // Clear: Ctrl/Cmd + K
      if (modKey && e.key === 'k' && shortcuts.onClear) {
        e.preventDefault();
        shortcuts.onClear();
        return;
      }

      // Focus text: Ctrl/Cmd + L
      if (modKey && e.key === 'l' && shortcuts.onFocusText) {
        e.preventDefault();
        shortcuts.onFocusText();
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if (modKey && e.key === 'z' && !e.shiftKey && shortcuts.onUndo) {
        e.preventDefault();
        shortcuts.onUndo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if (modKey && e.key === 'z' && e.shiftKey && shortcuts.onRedo) {
        e.preventDefault();
        shortcuts.onRedo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

