import React, { useState, useEffect, useRef } from 'react';
import { initialSubjects } from './data/subjectsData';
import { Subject, Assignment, Note } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SubjectCard } from './components/SubjectCard';
import { AssignmentModal } from './components/AssignmentModal';
import { AuthScreen } from './components/AuthScreen';
import { Footer } from './components/Footer';
import { MyFilesSection } from './components/MyFilesSection';
import { MyNotesSection } from './components/MyNotesSection';
import { TeamMembersSection } from './components/TeamMembersSection';
import { NewFolderModal } from './components/modals/NewFolderModal';
import { AddFileModal } from './components/modals/AddFileModal';
import { NewNoteModal } from './components/modals/NewNoteModal';
import { AddMemberModal } from './components/modals/AddMemberModal';
import { ViewNoteModal } from './components/modals/ViewNoteModal';
import { useAuth } from './context/AuthContext';
import { useUserWorkspace } from './hooks/useUserWorkspace';
import { BookOpen, Search, HardDrive, StickyNote, Users, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    folders,
    files,
    notes,
    teamMembers,
    loading: workspaceLoading,
    createFolder,
    deleteFolder,
    addFile,
    deleteFile,
    createNote,
    updateNote,
    deleteNote,
    addTeamMember,
    deleteTeamMember,
  } = useUserWorkspace(user);

  // Subject and assignments local data
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('college_assignment_hub_subjects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialSubjects;
      }
    }
    return initialSubjects;
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'all' | 'pending' | 'submitted'>('all');
  const [activeNav, setActiveNav] = useState('Dashboard');

  // Modal states for Firebase sections
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [targetFolderIdForFile, setTargetFolderIdForFile] = useState<string | undefined>(undefined);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNoteForView, setSelectedNoteForView] = useState<Note | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Sync subjects to local storage
  useEffect(() => {
    localStorage.setItem('college_assignment_hub_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleScrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleViewSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsAssignmentModalOpen(true);
  };

  const handleCloseAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
  };

  const handleUpdateStatus = (subjectId: string, assignmentId: string, newStatus: Assignment['status']) => {
    setSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id === subjectId) {
          const updatedAssignments = subj.assignments.map((asgn) => {
            if (asgn.id === assignmentId) {
              return { ...asgn, status: newStatus };
            }
            return asgn;
          });
          const updatedSubject = { ...subj, assignments: updatedAssignments };
          if (selectedSubject && selectedSubject.id === subjectId) {
            setSelectedSubject(updatedSubject);
          }
          return updatedSubject;
        }
        return subj;
      })
    );
  };

  // Compute stats
  const totalAssignmentsCount = subjects.reduce((acc, s) => acc + s.assignments.length, 0);
  const totalPendingCount = subjects.reduce(
    (acc, s) => acc + s.assignments.filter((a) => a.status !== 'Submitted').length,
    0
  );
  const totalSubmittedCount = subjects.reduce(
    (acc, s) => acc + s.assignments.filter((a) => a.status === 'Submitted').length,
    0
  );

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white animate-pulse shadow-sm">
            <div className="w-5 h-5 border-2 border-white rounded-xs"></div>
          </div>
          <span className="text-xs font-semibold text-slate-500 tracking-wide">
            Loading Assignment Hub...
          </span>
        </div>
      </div>
    );
  }

  // If unauthenticated, show Auth screen
  if (!user) {
    return <AuthScreen />;
  }

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.assignments.some((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (selectedTagFilter === 'pending') {
      return subject.assignments.some((a) => a.status !== 'Submitted');
    }
    if (selectedTagFilter === 'submitted') {
      return subject.assignments.some((a) => a.status === 'Submitted');
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased">
      {/* 1. Header */}
      <Header
        onViewAssignmentsClick={handleScrollToContent}
        totalPending={totalPendingCount}
        activeNav={activeNav}
        onNavClick={(nav) => {
          setActiveNav(nav);
          handleScrollToContent();
        }}
      />

      <main className="grow">
        {/* 2. Hero with Live Metrics & Tab Switchers */}
        <Hero
          onViewAssignmentsClick={handleScrollToContent}
          totalAssignments={totalAssignmentsCount}
          totalSubjects={subjects.length}
          foldersCount={folders.length}
          filesCount={files.length}
          notesCount={notes.length}
          membersCount={teamMembers.length}
          activeNav={activeNav}
          onSelectTab={(tab) => {
            setActiveNav(tab);
            handleScrollToContent();
          }}
        />

        {/* 3. Main Interactive Workspace Section */}
        <section
          id="workspace-main-section"
          ref={mainContentRef}
          className="max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-10 scroll-mt-20"
        >
          {/* Section Navigation Tabs (Segmented Control) */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-8 overflow-x-auto">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-semibold">
              <button
                type="button"
                id="tab-modules-btn"
                onClick={() => setActiveNav('Dashboard')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeNav === 'Dashboard'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Course Modules</span>
                <span className="ml-1 text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                  {subjects.length}
                </span>
              </button>

              <button
                type="button"
                id="tab-files-btn"
                onClick={() => setActiveNav('My Files')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeNav === 'My Files'
                    ? 'bg-white text-amber-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>My Files</span>
                <span className="ml-1 text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                  {files.length}
                </span>
              </button>

              <button
                type="button"
                id="tab-notes-btn"
                onClick={() => setActiveNav('My Notes')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeNav === 'My Notes'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <StickyNote className="w-3.5 h-3.5 text-emerald-600" />
                <span>My Notes</span>
                <span className="ml-1 text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                  {notes.length}
                </span>
              </button>

              <button
                type="button"
                id="tab-team-btn"
                onClick={() => setActiveNav('Team Members')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeNav === 'Team Members'
                    ? 'bg-white text-violet-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-violet-600" />
                <span>Team Members</span>
                <span className="ml-1 text-[10px] bg-violet-50 text-violet-800 px-1.5 py-0.5 rounded-full font-bold">
                  {teamMembers.length}
                </span>
              </button>
            </div>

            {/* User State Hint */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Firestore Live Sync Active</span>
            </div>
          </div>

          {/* Tab View 1: My Files */}
          {activeNav === 'My Files' && (
            <MyFilesSection
              folders={folders}
              files={files}
              loading={workspaceLoading}
              onOpenNewFolderModal={() => setIsFolderModalOpen(true)}
              onOpenAddFileModal={(folderId) => {
                setTargetFolderIdForFile(folderId);
                setIsFileModalOpen(true);
              }}
              onDeleteFolder={deleteFolder}
              onDeleteFile={deleteFile}
            />
          )}

          {/* Tab View 2: My Notes */}
          {activeNav === 'My Notes' && (
            <MyNotesSection
              notes={notes}
              loading={workspaceLoading}
              onOpenNewNoteModal={() => setIsNoteModalOpen(true)}
              onSelectNote={(note) => setSelectedNoteForView(note)}
              onDeleteNote={deleteNote}
            />
          )}

          {/* Tab View 3: Team Members */}
          {activeNav === 'Team Members' && (
            <TeamMembersSection
              members={teamMembers}
              loading={workspaceLoading}
              currentUserEmail={user.email}
              onOpenAddMemberModal={() => setIsMemberModalOpen(true)}
              onDeleteMember={deleteTeamMember}
            />
          )}

          {/* Tab View 4: Course Modules & Assignments (Dashboard view) */}
          {(activeNav === 'Dashboard' || activeNav === 'Courses') && (
            <div className="space-y-6">
              {/* Section Header with Search & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Course Modules
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Overview of current semester subjects and assignment progress
                  </p>
                </div>

                {/* Clean Search & Status Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="search-assignments-input"
                      type="text"
                      placeholder="Search subject or task..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 sm:w-56 pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Status toggles */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                      id="filter-all-btn"
                      onClick={() => setSelectedTagFilter('all')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedTagFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({subjects.length})
                    </button>
                    <button
                      id="filter-pending-btn"
                      onClick={() => setSelectedTagFilter('pending')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedTagFilter === 'pending'
                          ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Due ({totalPendingCount})
                    </button>
                    <button
                      id="filter-submitted-btn"
                      onClick={() => setSelectedTagFilter('submitted')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                        selectedTagFilter === 'submitted'
                          ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Done ({totalSubmittedCount})
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards Grid: 5 Subjects */}
              {filteredSubjects.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">No subjects found matching "{searchQuery}".</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTagFilter('all');
                    }}
                    className="mt-2 text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Reset search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredSubjects.map((subject, index) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      index={index}
                      onViewClick={handleViewSubject}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* In-App Modals (Strictly No Browser Prompts/Alerts) */}
        <NewFolderModal
          isOpen={isFolderModalOpen}
          onClose={() => setIsFolderModalOpen(false)}
          onSubmit={createFolder}
        />

        <AddFileModal
          isOpen={isFileModalOpen}
          folders={folders}
          currentFolderId={targetFolderIdForFile}
          onClose={() => {
            setIsFileModalOpen(false);
            setTargetFolderIdForFile(undefined);
          }}
          onSubmit={addFile}
        />

        <NewNoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          onSubmit={createNote}
        />

        <AddMemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          onSubmit={addTeamMember}
        />

        <ViewNoteModal
          isOpen={!!selectedNoteForView}
          note={selectedNoteForView}
          onClose={() => setSelectedNoteForView(null)}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
        />

        {/* Assignment Details Modal */}
        <AnimatePresence>
          {isAssignmentModalOpen && selectedSubject && (
            <AssignmentModal
              subject={selectedSubject}
              isOpen={isAssignmentModalOpen}
              onClose={handleCloseAssignmentModal}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


