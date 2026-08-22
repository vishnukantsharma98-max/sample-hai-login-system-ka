import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Folder, FileDoc, Note, TeamMember, UserProfile } from '../types';

export function useUserWorkspace(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileDoc[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setFolders([]);
      setFiles([]);
      setNotes([]);
      setTeamMembers([]);
      setLoading(false);
      return;
    }

    const uid = user.uid;
    setLoading(true);

    // 1. Ensure user profile document exists
    const userDocRef = doc(db, 'users', uid);
    setDoc(
      userDocRef,
      {
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Student',
        plan: 'Pro Student',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    ).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    });

    // Listen to User Profile
    const unsubProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      }
    );

    // 2. Folders listener
    const foldersPath = `users/${uid}/folders`;
    const foldersQuery = query(collection(db, 'users', uid, 'folders'), orderBy('createdAt', 'desc'));
    const unsubFolders = onSnapshot(
      foldersQuery,
      (snap) => {
        const loaded: Folder[] = [];
        snap.forEach((d) => {
          const data = d.data();
          loaded.push({
            id: d.id,
            name: data.name || 'Untitled Folder',
            createdAt: data.createdAt,
          });
        });
        setFolders(loaded);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, foldersPath);
      }
    );

    // 3. Files listener
    const filesPath = `users/${uid}/files`;
    const filesQuery = query(collection(db, 'users', uid, 'files'), orderBy('createdAt', 'desc'));
    const unsubFiles = onSnapshot(
      filesQuery,
      (snap) => {
        const loaded: FileDoc[] = [];
        snap.forEach((d) => {
          const data = d.data();
          loaded.push({
            id: d.id,
            name: data.name || 'Untitled File',
            folderId: data.folderId,
            size: data.size || '1.0 MB',
            createdAt: data.createdAt,
          });
        });
        setFiles(loaded);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, filesPath);
      }
    );

    // 4. Notes listener
    const notesPath = `users/${uid}/notes`;
    const notesQuery = query(collection(db, 'users', uid, 'notes'), orderBy('createdAt', 'desc'));
    const unsubNotes = onSnapshot(
      notesQuery,
      (snap) => {
        const loaded: Note[] = [];
        snap.forEach((d) => {
          const data = d.data();
          loaded.push({
            id: d.id,
            title: data.title || 'Untitled Note',
            content: data.content || '',
            createdAt: data.createdAt,
          });
        });
        setNotes(loaded);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, notesPath);
      }
    );

    // 5. Team Members listener
    const membersPath = `users/${uid}/teamMembers`;
    const membersQuery = query(collection(db, 'users', uid, 'teamMembers'), orderBy('createdAt', 'desc'));
    const unsubMembers = onSnapshot(
      membersQuery,
      (snap) => {
        const loaded: TeamMember[] = [];
        snap.forEach((d) => {
          const data = d.data();
          loaded.push({
            id: d.id,
            name: data.name || 'Unnamed Member',
            role: data.role,
            createdAt: data.createdAt,
          });
        });
        setTeamMembers(loaded);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, membersPath);
        setLoading(false);
      }
    );

    return () => {
      unsubProfile();
      unsubFolders();
      unsubFiles();
      unsubNotes();
      unsubMembers();
    };
  }, [user]);

  // Actions
  const createFolder = async (name: string) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/folders`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'folders'), {
        name,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/folders/${folderId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'folders', folderId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addFile = async (data: { name: string; folderId?: string; size: string }) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/files`;
    try {
      const payload: any = {
        name: data.name,
        size: data.size,
        createdAt: serverTimestamp(),
      };
      if (data.folderId) {
        payload.folderId = data.folderId;
      }
      await addDoc(collection(db, 'users', user.uid, 'files'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/files/${fileId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'files', fileId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const createNote = async (data: { title: string; content?: string }) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/notes`;
    try {
      const payload: any = {
        title: data.title,
        createdAt: serverTimestamp(),
      };
      if (data.content) {
        payload.content = data.content;
      }
      await addDoc(collection(db, 'users', user.uid, 'notes'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateNote = async (noteId: string, data: { title: string; content?: string }) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/notes/${noteId}`;
    try {
      const payload: any = {
        title: data.title,
      };
      if (data.content !== undefined) {
        payload.content = data.content;
      }
      await updateDoc(doc(db, 'users', user.uid, 'notes', noteId), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/notes/${noteId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'notes', noteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addTeamMember = async (data: { name: string; role?: string }) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/teamMembers`;
    try {
      const payload: any = {
        name: data.name,
        createdAt: serverTimestamp(),
      };
      if (data.role) {
        payload.role = data.role;
      }
      await addDoc(collection(db, 'users', user.uid, 'teamMembers'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    if (!user) throw new Error('User not authenticated');
    const path = `users/${user.uid}/teamMembers/${memberId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'teamMembers', memberId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return {
    profile,
    folders,
    files,
    notes,
    teamMembers,
    loading,
    createFolder,
    deleteFolder,
    addFile,
    deleteFile,
    createNote,
    updateNote,
    deleteNote,
    addTeamMember,
    deleteTeamMember,
  };
}
