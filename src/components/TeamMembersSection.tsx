import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { TeamMember } from '../types';

interface TeamMembersSectionProps {
  members: TeamMember[];
  loading: boolean;
  currentUserEmail?: string | null;
  onOpenAddMemberModal: () => void;
  onDeleteMember: (memberId: string) => Promise<void>;
}

export const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  members,
  loading,
  currentUserEmail,
  onOpenAddMemberModal,
  onDeleteMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredMembers = members.filter((member) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      member.name.toLowerCase().includes(q) ||
      (member.role && member.role.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (memberId: string) => {
    setDeletingId(memberId);
    try {
      await onDeleteMember(memberId);
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Color palette for member avatars
  const avatarColors = [
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-violet-100 text-violet-700 border-violet-200',
    'bg-sky-100 text-sky-700 border-sky-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-rose-100 text-rose-700 border-rose-200',
  ];

  return (
    <div id="team-members-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Team Members & Collaborators</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Collaborate on group capstone assignments, lab submissions, and peer study groups
          </p>
        </div>

        <button
          type="button"
          id="add-member-btn"
          onClick={onOpenAddMemberModal}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-violet-200 hover:shadow-md hover:shadow-violet-200/50 transition-all cursor-pointer flex items-center gap-1.5 active:scale-98 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Owner / Workspace Info Banner */}
      <div className="p-4 bg-gradient-to-r from-violet-50/80 to-indigo-50/80 rounded-2xl border border-violet-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {currentUserEmail ? currentUserEmail.slice(0, 2).toUpperCase() : 'ME'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{currentUserEmail || 'You (Workspace Owner)'}</span>
              <span className="text-[10px] font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full border border-violet-200">
                Lead Student / Owner
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Primary authenticated workspace holder</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Private User Workspace</span>
        </div>
      </div>

      {/* Search */}
      {members.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team members by name or role..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-2xs"
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
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="grow space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-2.5 bg-slate-100 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-8 sm:p-12 bg-white rounded-2xl border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mx-auto mb-3 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery ? 'No matching team members found' : 'No team members added yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? 'Try searching with different keywords.'
              : 'Add your project partners, lab team colleagues, and study group peers to keep work organized.'}
          </p>
          <button
            type="button"
            onClick={onOpenAddMemberModal}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Teammate</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, idx) => {
            const colorClass = avatarColors[idx % avatarColors.length];
            return (
              <motion.div
                key={member.id}
                whileHover={{ y: -2 }}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${colorClass} shrink-0`}>
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {member.name}
                    </h4>
                    {member.role ? (
                      <span className="inline-block text-[11px] font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100 mt-0.5 truncate max-w-full">
                        {member.role}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Team Member</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(member.id)}
                  disabled={deletingId === member.id}
                  title="Remove member"
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
