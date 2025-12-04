// Batch text processing - Upload multiple files

import { motion } from 'framer-motion';
import { Upload, FileText, Play, Download, X, Check } from 'lucide-react';
import { useState } from 'react';
import { VoiceSettings } from '../types';

interface BatchItem {
  id: string;
  filename: string;
  text: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  audioUrl?: string;
}

interface BatchProcessorProps {
  onProcess: (items: BatchItem[]) => void;
}

export const BatchProcessor = ({ onProcess }: BatchProcessorProps) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: BatchItem[] = [];

    files.forEach((file) => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          newItems.push({
            id: Date.now().toString() + Math.random(),
            filename: file.name,
            text,
            status: 'pending'
          });
          
          if (newItems.length === files.length) {
            setItems(prev => [...prev, ...newItems]);
          }
        };
        reader.readAsText(file);
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleProcess = () => {
    if (items.length === 0) return;
    setProcessing(true);
    onProcess(items);
    // Simulate processing
    setTimeout(() => {
      setItems(items.map(item => ({ ...item, status: 'completed' })));
      setProcessing(false);
    }, 2000);
  };

  const handleDownloadAll = () => {
    // Create ZIP or download all as individual files
    items.forEach((item, index) => {
      if (item.text) {
        const blob = new Blob([item.text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.filename || `batch-${index + 1}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-xl p-4 border border-dark-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-dark-text">Batch Processing</h3>
          <span className="text-sm text-dark-textSecondary">({items.length} files)</span>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadAll}
                className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProcess}
                disabled={processing}
                className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm flex items-center gap-1 disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                Process All
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block w-full p-4 rounded-lg border-2 border-dashed border-dark-border/50 bg-dark-surface/30 hover:bg-dark-surface/50 cursor-pointer transition-colors">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-dark-textSecondary" />
            <span className="text-sm text-dark-textSecondary">
              Click to upload multiple .txt files
            </span>
          </div>
          <input
            type="file"
            multiple
            accept=".txt,text/plain"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
        {items.length === 0 ? (
          <div className="text-center py-8 text-dark-textSecondary">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No files uploaded</p>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg border border-dark-border/50 bg-dark-surface/30 flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-dark-text truncate">{item.filename}</span>
                  {item.status === 'completed' && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="text-xs text-dark-textSecondary">
                  {item.text.length} characters • {item.text.split(/\s+/).length} words
                </div>
                <div className="text-xs text-dark-textSecondary mt-1">
                  Status: <span className={
                    item.status === 'completed' ? 'text-green-400' :
                    item.status === 'processing' ? 'text-yellow-400' :
                    item.status === 'error' ? 'text-red-400' :
                    'text-dark-textSecondary'
                  }>{item.status}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

