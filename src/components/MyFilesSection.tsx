import React, { useState } from 'react';
import { 
  FolderPlus, 
  FileUp, 
  Folder as FolderIcon, 
  FileText, 
  Trash2, 
  FolderOpen, 
  HardDrive, 
  Search, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  FileCode,
  FileArchive,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, FileDoc } from '../types';

interface MyFilesSectionProps {
  folders: Folder[];
  files: FileDoc[];
  loading: boolean;
  onOpenNewFolderModal: () => void;
  onOpenAddFileModal: (folderId?: string) => void;
  onDeleteFolder: (folderId: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
}

export const MyFilesSection: React.FC<MyFilesSectionProps> = ({
  folders,
  files,
  loading,
  onOpenNewFolderModal,
  onOpenAddFileModal,
  onDeleteFolder,
  onDeleteFile,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Active folder entity if one is clicked
  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  // Filtered files
  const filteredFiles = files.filter((file) => {
    // If inside a folder, only show files belonging to this folder
    if (selectedFolderId) {
      if (file.folderId !== selectedFolderId) return false;
    } else {
      // In root overview: show all files or files not in folder, but let's allow searching across all
      // If no folder selected, let user see root files or all files
    }

    if (searchQuery.trim()) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    }
    return true;
  });

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(folderId);
    try {
      await onDeleteFolder(folderId);
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteFile = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(fileId);
    try {
      await onDeleteFile(fileId);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to pick file icon by extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['cpp', 'py', 'js', 'ts', 'jsx', 'tsx', 'html', 'json', 'sql'].includes(ext || '')) {
      return <FileCode className="w-5 h-5 text-indigo-500" />;
    }
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext || '')) {
      return <FileArchive className="w-5 h-5 text-amber-500" />;
    }
    if (['csv', 'xlsx', 'xls'].includes(ext || '')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div id="my-files-section" className="space-y-6">
      {/* Section Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <HardDrive className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Files & Storage</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage course folders, assignments sheets, problem sets, and metadata assets
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="new-folder-btn"
            onClick={onOpenNewFolderModal}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <FolderPlus className="w-4 h-4 text-amber-600" />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            id="add-file-btn"
            onClick={() => onOpenAddFileModal(selectedFolderId || undefined)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200/50 transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <FileUp className="w-4 h-4" />
            <span>Add File</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb / Folder Navigation Bar */}
      {selectedFolderId && activeFolder && (
        <div className="flex items-center justify-between bg-amber-50/60 border border-amber-200/70 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className="text-amber-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Root Files</span>
            </button>
            <ChevronRight className="w-3 h-3 text-amber-400" />
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>{activeFolder.name}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            View All Folders
          </button>
        </div>
      )}

      {/* Search Bar */}
      {(folders.length > 0 || files.length > 0) && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by name..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
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

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                <div className="grow space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-2.5 bg-slate-100 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Folders Subsection (Shown if not inside a specific folder view) */}
          {!selectedFolderId && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Folders ({folders.length})
                </h3>
              </div>

              {folders.length === 0 ? (
                <div className="p-6 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 text-center">
                  <FolderPlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No folders created yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Organize assignments into custom course folders</p>
                  <button
                    type="button"
                    onClick={onOpenNewFolderModal}
                    className="mt-3 px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Create your first folder</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {folders.map((folder) => {
                    const countInFolder = files.filter((f) => f.folderId === folder.id).length;
                    return (
                      <motion.div
                        key={folder.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedFolderId(folder.id)}
                        className="group bg-white hover:bg-amber-50/40 p-4 rounded-xl border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors shrink-0">
                            <FolderIcon className="w-5 h-5 fill-amber-500/20" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-amber-900 transition-colors">
                              {folder.name}
                            </h4>
                            <span className="text-[11px] font-medium text-slate-400">
                              {countInFolder} {countInFolder === 1 ? 'file' : 'files'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteFolder(folder.id, e)}
                          disabled={deletingId === folder.id}
                          title="Delete folder"
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Files Subsection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {selectedFolderId && activeFolder
                  ? `Files in "${activeFolder.name}" (${filteredFiles.length})`
                  : `All Files (${files.length})`}
              </h3>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
                <FileUp className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <h4 className="text-sm font-bold text-slate-800">
                  {searchQuery ? 'No files match your search' : 'No files found'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {selectedFolderId
                    ? 'This folder is currently empty. Add your coursework problem sets or lecture PDFs.'
                    : 'Track your PDF problem sets, code archives, or lecture slides here.'}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenAddFileModal(selectedFolderId || undefined)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Add File Now</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {filteredFiles.map((file) => {
                  const parentFolder = folders.find((f) => f.id === file.folderId);
                  return (
                    <div
                      key={file.id}
                      className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {file.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {file.size}
                            </span>
                            {parentFolder && !selectedFolderId && (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                <FolderIcon className="w-2.5 h-2.5" />
                                <span>{parentFolder.name}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFile(file.id, e)}
                          disabled={deletingId === file.id}
                          title="Delete file metadata"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
