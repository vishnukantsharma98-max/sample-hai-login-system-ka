import React, { useState } from 'react';
import { FolderPlus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => Promise<void>;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Folder name is required.');
      return;
    }
    if (trimmed.length > 100) {
      setError('Folder name cannot exceed 100 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit(trimmed);
      setName('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create folder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Folder</h3>
                <p className="text-xs text-slate-500">Create a directory to organize your files</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="folder-name-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Folder Name <span className="text-red-500">*</span>
              </label>
              <input
                id="folder-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., Mathematics & Calculus"
                autoFocus
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-folder-btn"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Folder</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
