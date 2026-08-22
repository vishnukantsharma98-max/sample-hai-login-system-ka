import React, { useState } from 'react';
import { FileUp, X, Loader2, Folder as FolderIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder } from '../../types';

interface AddFileModalProps {
  isOpen: boolean;
  folders: Folder[];
  currentFolderId?: string;
  onClose: () => void;
  onSubmit: (fileData: { name: string; folderId?: string; size: string }) => Promise<void>;
}

export const AddFileModal: React.FC<AddFileModalProps> = ({
  isOpen,
  folders,
  currentFolderId,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState(currentFolderId || '');
  const [size, setSize] = useState('1.8 MB');
  const [customSize, setCustomSize] = useState('');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('File name is required.');
      return;
    }
    const finalSize = isCustomSize ? (customSize.trim() || '1.0 MB') : size;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: trimmedName,
        folderId: folderId ? folderId : undefined,
        size: finalSize,
      });
      setName('');
      setFolderId('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add file.');
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
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-2xs">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add File</h3>
                <p className="text-xs text-slate-500">Record metadata for study or course documents</p>
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
              <label htmlFor="file-name-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                File Name <span className="text-red-500">*</span>
              </label>
              <input
                id="file-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., Calculus_Problem_Set_4.pdf"
                autoFocus
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
            </div>

            <div>
              <label htmlFor="file-folder-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Folder <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <select
                  id="file-folder-select"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">No folder (Root directory)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                File Size
              </label>
              {!isCustomSize ? (
                <div className="flex items-center gap-2">
                  <select
                    value={size}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomSize(true);
                      } else {
                        setSize(e.target.value);
                      }
                    }}
                    disabled={loading}
                    className="grow px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="540 KB">540 KB (Compact Note)</option>
                    <option value="1.8 MB">1.8 MB (Standard PDF)</option>
                    <option value="4.2 MB">4.2 MB (Slides Deck)</option>
                    <option value="12.5 MB">12.5 MB (Full Textbook/Lab)</option>
                    <option value="custom">Custom size...</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="e.g. 2.4 MB or 850 KB"
                    className="grow px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomSize(false)}
                    className="text-xs text-indigo-600 hover:underline px-2"
                  >
                    Presets
                  </button>
                </div>
              )}
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
                id="submit-file-btn"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding File...</span>
                  </>
                ) : (
                  <span>Add File</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
