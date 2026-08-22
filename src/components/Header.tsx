import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onViewAssignmentsClick: () => void;
  totalPending: number;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onViewAssignmentsClick,
  totalPending,
  activeNav = 'Dashboard',
  onNavClick,
}) => {
  const { user, signOut } = useAuth();

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4">
        {/* Brand with Geometric Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-xs">
            <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-indigo-900">
            Assignment Hub
          </span>
        </div>

        {/* Geometric Balance Nav items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            id="nav-dashboard-btn"
            onClick={() => onNavClick?.('Dashboard')}
            className={`cursor-pointer transition-colors ${
              activeNav === 'Dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Course Modules
          </button>
          <button
            id="nav-files-btn"
            onClick={() => onNavClick?.('My Files')}
            className={`cursor-pointer transition-colors ${
              activeNav === 'My Files' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Files
          </button>
          <button
            id="nav-notes-btn"
            onClick={() => onNavClick?.('My Notes')}
            className={`cursor-pointer transition-colors ${
              activeNav === 'My Notes' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Notes
          </button>
          <button
            id="nav-team-btn"
            onClick={() => onNavClick?.('Team Members')}
            className={`cursor-pointer transition-colors ${
              activeNav === 'Team Members' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Team Members
          </button>
        </nav>

        {/* User profile & Pending Indicator & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            <span>{totalPending} Tasks Due</span>
          </div>

          {/* User Email & Badge */}
          <div
            id="user-profile-badge"
            title={user?.email || 'Student'}
            className="flex items-center gap-2 pl-2 sm:pl-3 py-1 pr-1 bg-slate-50 rounded-full border border-slate-200"
          >
            <span className="hidden sm:inline text-xs font-medium text-slate-700 max-w-[130px] truncate">
              {user?.email}
            </span>
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-700 border border-indigo-200 select-none">
              {userInitials}
            </div>
          </div>

          {/* Logout Button */}
          <button
            id="logout-btn"
            onClick={() => signOut()}
            title="Sign Out and return to Auth screen"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};


