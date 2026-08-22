import React from 'react';
import { ArrowDown, Layers, HardDrive, StickyNote, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onViewAssignmentsClick: () => void;
  totalAssignments: number;
  totalSubjects: number;
  foldersCount?: number;
  filesCount?: number;
  notesCount?: number;
  membersCount?: number;
  activeNav?: string;
  onSelectTab?: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onViewAssignmentsClick,
  totalAssignments,
  totalSubjects,
  foldersCount = 0,
  filesCount = 0,
  notesCount = 0,
  membersCount = 0,
  activeNav = 'Dashboard',
  onSelectTab,
}) => {
  return (
    <section
      id="hero-section"
      className="relative flex flex-col items-center justify-center text-center px-6 sm:px-10 py-10 sm:py-14 md:py-16 bg-gradient-to-b from-indigo-50/40 via-white to-white border-b border-slate-100"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Academic Portal Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block px-3 py-1 bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            Academic & Workspace Portal 2026
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight"
        >
          Your Coursework & Workspace <span className="text-indigo-600">in One Place</span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed"
        >
          Manage coursework assignments, cloud study files, lecture notes, and team collaborators with real-time Firebase synchronization.
        </motion.p>

        {/* Quick Workspace Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {/* Modules Card */}
          <button
            type="button"
            onClick={() => onSelectTab?.('Dashboard')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeNav === 'Dashboard'
                ? 'bg-indigo-50/80 border-indigo-200 ring-2 ring-indigo-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Modules</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {totalSubjects}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{totalAssignments} assignments</p>
          </button>

          {/* Files Card */}
          <button
            type="button"
            onClick={() => onSelectTab?.('My Files')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeNav === 'My Files'
                ? 'bg-amber-50/80 border-amber-200 ring-2 ring-amber-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Files</span>
              <HardDrive className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {filesCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{foldersCount} {foldersCount === 1 ? 'folder' : 'folders'}</p>
          </button>

          {/* Notes Card */}
          <button
            type="button"
            onClick={() => onSelectTab?.('My Notes')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeNav === 'My Notes'
                ? 'bg-emerald-50/80 border-emerald-200 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Notes</span>
              <StickyNote className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {notesCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Study notes saved</p>
          </button>

          {/* Team Members Card */}
          <button
            type="button"
            onClick={() => onSelectTab?.('Team Members')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeNav === 'Team Members'
                ? 'bg-violet-50/80 border-violet-200 ring-2 ring-violet-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-violet-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Team</span>
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {membersCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Collaborators</p>
          </button>
        </motion.div>
      </div>
    </section>
  );
};


