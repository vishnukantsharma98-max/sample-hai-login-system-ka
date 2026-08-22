import React from 'react';
import { Subject } from '../types';
import { 
  ArrowRight, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SubjectCardProps {
  subject: Subject;
  onViewClick: (subject: Subject) => void;
  index: number;
}

// Geometric symbol & badge styling based on Geometric Balance theme
const getGeometricBadge = (id: string, name: string) => {
  switch (id) {
    case 'mathematics':
      return {
        symbol: 'Σ',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-100',
      };
    case 'cpp':
      return {
        symbol: '++',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-100',
      };
    case 'python':
      return {
        symbol: 'Py',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-100',
      };
    case 'dsa':
      return {
        symbol: 'Dλ',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-100',
      };
    case 'ai':
      return {
        symbol: 'Ai',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-100',
      };
    default:
      return {
        symbol: name.slice(0, 2),
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-100',
      };
  }
};

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onViewClick, index }) => {
  const pendingCount = subject.assignments.filter((a) => a.status !== 'Submitted').length;
  const nextPending = subject.assignments.find((a) => a.status === 'Pending' || a.status === 'In Progress');
  const badge = getGeometricBadge(subject.id, subject.name);

  return (
    <motion.div
      id={`subject-card-${subject.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
    >
      <div>
        {/* Top Geometric Symbol & Subject Code */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div
            className={`w-10 h-10 ${badge.bg} ${badge.text} border ${badge.border} rounded-lg flex items-center justify-center font-bold text-sm select-none shadow-2xs group-hover:scale-105 transition-transform duration-200`}
          >
            <span>{badge.symbol}</span>
          </div>

          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {subject.code}
          </span>
        </div>

        {/* Subject Title */}
        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors tracking-tight">
          {subject.name}
        </h3>

        {/* Pending Tasks Notice */}
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          {pendingCount > 0 ? (
            <span className="font-medium text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {pendingCount} {pendingCount === 1 ? 'Pending Task' : 'Pending Tasks'}
            </span>
          ) : (
            <span className="font-medium text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              No Pending Tasks
            </span>
          )}
        </p>

        {/* Short description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {subject.shortDesc}
        </p>

        {/* Course Info */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[11px] text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{subject.instructor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">
              {nextPending ? `Due: ${nextPending.dueDate}` : 'All caught up'}
            </span>
          </div>
        </div>
      </div>

      {/* View Button styled according to Geometric Balance */}
      <button
        id={`view-btn-${subject.id}`}
        onClick={() => onViewClick(subject)}
        className="w-full py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-bold rounded-lg border border-slate-200/80 hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 shadow-2xs"
        aria-label={`View assignments for ${subject.name}`}
      >
        <span>View</span>
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  );
};

