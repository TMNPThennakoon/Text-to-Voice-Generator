// Text templates selector component

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Plus, Search, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import { templateManager } from '../utils/textTemplates';
import { TextTemplate } from '../types';

interface TemplateSelectorProps {
  onSelect: (template: TextTemplate) => void;
  onClose?: () => void;
}

export const TemplateSelector = ({ onSelect, onClose }: TemplateSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  const templates = templateManager.getAll();
  const categories = ['All', ...templateManager.getCategories()];
  const languages = ['All', ...Array.from(new Set(templates.map(t => t.language)))];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'All' || template.language === selectedLanguage;
      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [templates, searchQuery, selectedCategory, selectedLanguage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-strong rounded-xl p-4 sm:p-6 border border-dark-border/50 max-h-[600px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg sm:text-xl font-semibold text-dark-text">Text Templates</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-textSecondary" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-textSecondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full glass border border-dark-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-dark-text placeholder-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 min-w-[120px] glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text bg-dark-surface/50 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="flex-1 min-w-[120px] glass border border-dark-border/50 rounded-lg px-3 py-2 text-sm text-dark-text bg-dark-surface/50 focus:outline-none"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
        <AnimatePresence>
          {filteredTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-dark-textSecondary"
            >
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No templates found</p>
            </motion.div>
          ) : (
            filteredTemplates.map((template) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(template)}
                className="w-full text-left p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 hover:bg-dark-surface/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-dark-text truncate">{template.name}</h4>
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                        {template.language.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-dark-textSecondary line-clamp-2">
                      {template.text}
                    </p>
                    <div className="mt-1 text-xs text-dark-textSecondary">
                      {template.category}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

