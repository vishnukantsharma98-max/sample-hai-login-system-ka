import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  FileText, 
  BookOpen, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { Note } from '../types';

interface MyNotesSectionProps {
  notes: Note[];
  loading: boolean;
  onOpenNewNoteModal: () => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export const MyNotesSection: React.FC<MyNotesSectionProps> = ({
  notes,
  loading,
  onOpenNewNoteModal,
  onSelectNote,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      note.title.toLowerCase().includes(q) ||
      (note.content && note.content.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(noteId);
    try {
      await onDeleteNote(noteId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div id="my-notes-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <StickyNote className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Study Notes</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store lecture key points, theorem summaries, formulas, and revision reminders
          </p>
        </div>

        <button
          type="button"
          id="new-note-btn"
          onClick={onOpenNewNoteModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200/50 transition-all cursor-pointer flex items-center gap-1.5 active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search */}
      {notes.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or content..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Content / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
              <div className="space-y-1.5">
                <div className="h-3 bg-slate-100 rounded-md w-full"></div>
                <div className="h-3 bg-slate-100 rounded-md w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="p-8 sm:p-12 bg-white rounded-2xl border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery ? 'No matching notes found' : 'No notes created yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? 'Try modifying your search keywords or clear the filter.'
              : 'Keep all your exam study sheets, problem breakdown tips, and lecture summaries in one place.'}
          </p>
          <button
            type="button"
            onClick={onOpenNewNoteModal}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ y: -3 }}
              onClick={() => onSelectNote(note)}
              className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md hover:shadow-emerald-500/5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(note.id, e)}
                    disabled={deletingId === note.id}
                    title="Delete Note"
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                  {note.title}
                </h3>

                {note.content ? (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-4 leading-relaxed font-normal">
                    {note.content}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-2">No body text</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Personal Note</span>
                </span>
                <span className="text-emerald-600 font-semibold group-hover:underline flex items-center gap-0.5">
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
