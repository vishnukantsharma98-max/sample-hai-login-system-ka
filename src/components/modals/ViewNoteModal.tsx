import React, { useState } from 'react';
import { StickyNote, X, Trash2, Edit3, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../../types';

interface ViewNoteModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onUpdateNote: (noteId: string, data: { title: string; content?: string }) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export const ViewNoteModal: React.FC<ViewNoteModalProps> = ({
  isOpen,
  note,
  onClose,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if note changes
  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setIsEditing(false);
      setError(null);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title cannot be empty');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onUpdateNote(note.id, {
        title: trimmed,
        content: content.trim() ? content.trim() : undefined,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to update note.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDeleteNote(note.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete note.');
    } finally {
      setDeleting(false);
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
          onClick={loading || deleting ? undefined : onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
                <StickyNote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Note Details
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit Note"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Note"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading || deleting}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="mt-4 grow overflow-y-auto space-y-4 pr-1">
            {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>}

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Content
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 leading-snug break-words">
                  {note.title}
                </h2>
                {note.content ? (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 font-normal">
                    {note.content}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No additional content provided.</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTitle(note.title);
                  setContent(note.content || '');
                  setIsEditing(false);
                }}
                disabled={loading}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
