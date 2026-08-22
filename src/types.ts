export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Submitted';
  weightage: string;
  format: string;
  totalPoints: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  shortDesc: string;
  instructor: string;
  room: string;
  iconName: string;
  color: string;
  assignments: Assignment[];
}

export interface UserProfile {
  displayName?: string;
  email: string;
  plan?: string;
  createdAt?: any;
}

export interface Folder {
  id: string;
  name: string;
  createdAt?: any;
}

export interface FileDoc {
  id: string;
  name: string;
  folderId?: string;
  size: string;
  createdAt?: any;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt?: any;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  createdAt?: any;
}
