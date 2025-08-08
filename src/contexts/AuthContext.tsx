import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { auth } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<void>;
  isTrialExpired: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const router = useRouter();

  const fetchUser = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (userData) {
        setUser(userData);
        const trialExpired = await auth.isTrialExpired(userData);
        setIsTrialExpired(trialExpired);
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
    }
  };

  const refreshUser = async () => {
    const currentUser = await auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const trialExpired = await auth.isTrialExpired(currentUser);
      setIsTrialExpired(trialExpired);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUser(currentSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await fetchUser(session.user);
        } else {
          setUser(null);
          setIsTrialExpired(false);
        }
        
        setLoading(false);

        if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.push('/');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await auth.signIn(email, password);
      if (user) {
        // Let onAuthStateChange handle the redirect
        // The router.push will happen after the session is properly set
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true);
    try {
      await auth.signUp(email, password, userData);
      router.push('/dashboard');
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await auth.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    await auth.updatePassword(password);
  };

  const updateUser = async (updates: Partial<User>) => {
    const updatedUser = await auth.updateUser(updates);
    setUser(updatedUser);
    return updatedUser;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateUser,
    refreshUser,
    isTrialExpired,
    isPremium: user?.is_premium || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}