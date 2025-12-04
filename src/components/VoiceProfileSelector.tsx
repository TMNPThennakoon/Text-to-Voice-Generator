// Voice profile selector component

import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, X, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { voiceProfileManager } from '../utils/voiceProfiles';
import { VoiceProfile, VoiceSettings } from '../types';

interface VoiceProfileSelectorProps {
  currentSettings: VoiceSettings;
  onSelect: (profile: VoiceProfile) => void;
  onSave?: (name: string, settings: VoiceSettings) => void;
  onClose?: () => void;
}

export const VoiceProfileSelector = ({
  currentSettings,
  onSelect,
  onSave,
  onClose,
}: VoiceProfileSelectorProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const profiles = voiceProfileManager.getAll();

  const handleSave = () => {
    if (!profileName.trim()) return;
    const profile = voiceProfileManager.create(profileName.trim(), currentSettings);
    if (onSave) {
      onSave(profile.name, profile.settings);
    }
    setShowSaveDialog(false);
    setProfileName('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this voice profile?')) {
      voiceProfileManager.delete(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-dark-text">Voice Profiles</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSaveDialog(true)}
            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
            title="Save current settings as profile"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-dark-textSecondary" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-dark-surface/50 border border-dark-border/30"
          >
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Profile name (e.g., Sinhala Male - Slow)"
              className="w-full glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text placeholder-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-dark-accent/50 mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setShowSaveDialog(false);
              }}
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowSaveDialog(false);
                  setProfileName('');
                }}
                className="px-3 py-1.5 rounded-lg bg-dark-surface hover:bg-dark-hover text-dark-text text-sm"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
        {profiles.length === 0 ? (
          <div className="text-center py-8 text-dark-textSecondary">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No profiles saved</p>
            <p className="text-xs mt-1">Save your current settings as a profile</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <motion.button
              key={profile.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(profile)}
              className="w-full text-left p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 hover:bg-dark-surface/50 transition-all flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-dark-text truncate">{profile.name}</h4>
                <div className="text-xs text-dark-textSecondary mt-1">
                  Rate: {profile.settings.rate.toFixed(1)}x • 
                  Pitch: {profile.settings.pitch.toFixed(1)} • 
                  Volume: {Math.round(profile.settings.volume * 100)}%
                </div>
                {profile.settings.voice && (
                  <div className="text-xs text-dark-textSecondary mt-1">
                    {profile.settings.voice.name}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => handleDelete(profile.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
};

