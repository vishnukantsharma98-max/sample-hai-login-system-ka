import React, { useState } from 'react';
import { UserPlus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: { name: string; role?: string }) => Promise<void>;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Study Partner');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Member name is required.');
      return;
    }
    const finalRole = isCustomRole ? (customRole.trim() || 'Contributor') : role;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: trimmedName,
        role: finalRole ? finalRole : undefined,
      });
      setName('');
      setCustomRole('');
      setIsCustomRole(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add member.');
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
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200/60 flex items-center justify-center text-violet-600 shadow-2xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Team Member</h3>
                <p className="text-xs text-slate-500">Add a peer, project teammate, or study buddy</p>
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
              <label htmlFor="member-name-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Member Name <span className="text-red-500">*</span>
              </label>
              <input
                id="member-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., Alex Johnson"
                autoFocus
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
              {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Role / Contribution <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              {!isCustomRole ? (
                <div className="flex items-center gap-2">
                  <select
                    value={role}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomRole(true);
                      } else {
                        setRole(e.target.value);
                      }
                    }}
                    disabled={loading}
                    className="grow px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Study Partner">Study Partner</option>
                    <option value="Lab Teammate">Lab Teammate</option>
                    <option value="Project Lead">Project Lead</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Developer">Developer</option>
                    <option value="custom">Custom role...</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g., Lead Algorithm Architect"
                    className="grow px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomRole(false)}
                    className="text-xs text-violet-600 hover:underline px-2"
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
                id="submit-member-btn"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding Member...</span>
                  </>
                ) : (
                  <span>Add Member</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
