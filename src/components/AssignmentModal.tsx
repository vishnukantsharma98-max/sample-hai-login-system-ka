import React, { useState } from 'react';
import { Subject, Assignment } from '../types';
import { 
  X, 
  Calendar, 
  FileText, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  MapPin, 
  ExternalLink,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssignmentModalProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (subjectId: string, assignmentId: string, newStatus: Assignment['status']) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  subject,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Submitted'>('All');

  if (!isOpen || !subject) return null;

  const filteredAssignments = subject.assignments.filter((a) => {
    if (filter === 'All') return true;
    return a.status === filter;
  });

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        id="assignment-details-modal"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {subject.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {subject.assignments.length} Course Assignments
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {subject.name}
              </h2>
            </div>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Course Details */}
          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Instructor: <strong className="font-semibold text-slate-800">{subject.instructor}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location: <strong className="font-semibold text-slate-800">{subject.room}</strong></span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['All', 'Pending', 'In Progress', 'Submitted'] as const).map((tab) => (
              <button
                key={tab}
                id={`filter-${tab.toLowerCase().replace(' ', '-')}`}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  filter === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content - List of Assignments */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No assignments found for '{filter}' status.</p>
            </div>
          ) : (
            filteredAssignments.map((assignment, idx) => (
              <div
                key={assignment.id}
                id={`assignment-item-${assignment.id}`}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 shadow-xs transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-base font-semibold text-slate-900">
                    {assignment.title}
                  </h4>
                  <div>{getStatusBadge(assignment.status)}</div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {assignment.description}
                </p>

                {/* Assignment Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Due: <strong className="font-semibold text-slate-700">{assignment.dueDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Weight: <strong className="font-semibold text-slate-700">{assignment.weightage} ({assignment.totalPoints} pts)</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Format: <strong className="font-semibold text-slate-700">{assignment.format}</strong></span>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-400">Update status:</span>
                  <div className="flex items-center gap-1.5">
                    {(['Pending', 'In Progress', 'Submitted'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateStatus(subject.id, assignment.id, st)}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          assignment.status === st
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Click on any status pill above to mark as Submitted or Pending.
          </span>
          <button
            id="modal-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
