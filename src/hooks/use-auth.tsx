
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  OAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '@/lib/firebase/client';
import { checkUserStatus } from '@/ai/flows/access-control-user-status';
import type { UserData } from '@/types';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const dbUser = snapshot.val() as UserData;
          setUserData(dbUser);
          if (dbUser.status === 'blocked') {
            toast({
              variant: 'destructive',
              title: 'Access Denied',
              description: 'Your account has been blocked. Please contact an administrator.',
            });
            await firebaseSignOut(auth);
            setUser(null);
            setUserData(null);
          }
        } else {
          // First time user, create profile
          const { uid, email, displayName } = firebaseUser;
          const isAdmin = email === 'sutad.k@icpfertilizer.com';
          const newUser: UserData = {
            uid: uid,
            email: email || '',
            displayName: displayName || 'New User',
            role: isAdmin ? 'admin' : 'user',
            status: 'active',
          };
          await set(userRef, newUser);
          setUserData(newUser);
          toast({
            title: 'Welcome to MeetingSphere!',
            description: 'Your account has been created.',
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const signIn = async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid } = result.user;

      // Check user status with GenAI flow
      const { isBlocked } = await checkUserStatus({ uid });

      if (isBlocked) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Your account is blocked. Please contact an administrator.',
        });
        await firebaseSignOut(auth);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
            console.log('Sign-in popup was closed or cancelled.');
            return;
        }
      console.error('Microsoft sign-in error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: 'Could not sign in with Microsoft. Please try again.',
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign-out Failed',
        description: 'An error occurred while signing out.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
