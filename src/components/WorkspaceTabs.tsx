// Workspace tabs component

import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { WorkspaceTab } from '../types';

interface WorkspaceTabsProps {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onAddTab: () => void;
  onRemoveTab: (id: string) => void;
  onSelectTab: (id: string) => void;
  onUpdateTabName: (id: string, name: string) => void;
}

export const WorkspaceTabs = ({
  tabs,
  activeTabId,
  onAddTab,
  onRemoveTab,
  onSelectTab,
  onUpdateTabName
}: WorkspaceTabsProps) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide mb-4">
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-b-2 transition-all cursor-pointer group min-w-[120px] ${
            tab.id === activeTabId
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-transparent hover:border-dark-border/50'
          }`}
          onClick={() => onSelectTab(tab.id)}
        >
          <input
            type="text"
            value={tab.name}
            onChange={(e) => onUpdateTabName(tab.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent border-none outline-none text-sm font-semibold text-dark-text flex-1 min-w-0"
            style={{ width: `${Math.max(tab.name.length * 8, 60)}px` }}
          />
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/20 rounded text-red-400 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </motion.div>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddTab}
        className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

