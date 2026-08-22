import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup,
  signOut as fbSignOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<string>;
  resendVerification: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Only treat user as authenticated if their email is verified (or null/Google with verified email)
      if (currentUser && !currentUser.emailVerified && currentUser.providerData.some(p => p.providerId === 'password')) {
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const trimmedEmail = email.trim();
    const res = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
    
    if (res.user && !res.user.emailVerified) {
      const userEmail = res.user.email || trimmedEmail;
      // Send verification email
      try {
        await sendEmailVerification(res.user);
      } catch (sendErr) {
        console.warn('Could not auto-resend verification email on login:', sendErr);
      }
      // Block access and sign out
      await fbSignOut(auth);
      const err: any = new Error('EMAIL_NOT_VERIFIED');
      err.code = 'auth/unverified-email';
      err.unverifiedEmail = userEmail;
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string): Promise<string> => {
    const trimmedEmail = email.trim();
    // 1. Create user
    const res = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
    
    // 2. Send email verification
    if (res.user) {
      await sendEmailVerification(res.user);
    }
    
    // 3. Do not sign them in automatically - sign out immediately
    await fbSignOut(auth);
    
    return trimmedEmail;
  };

  const resendVerification = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
    if (res.user) {
      await sendEmailVerification(res.user);
      if (!res.user.emailVerified) {
        await fbSignOut(auth);
      }
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      resendVerification,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

