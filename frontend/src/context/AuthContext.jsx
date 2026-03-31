import { createContext, useContext, useEffect, useState } from 'react';
<<<<<<< HEAD
import { supabase, apiFetch } from '../lib/supabase';
=======
import { supabase } from '../lib/supabase';
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    console.log('AuthProvider: supabase', !!supabase);
    if (!supabase) {
      console.log('AuthProvider: no supabase, setting loading false');
=======
    if (!supabase) {
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
      setLoading(false);
      return;
    }
    const initAuth = async () => {
<<<<<<< HEAD
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
=======
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        // Auto sign-in with default demo user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'sganeshvar.k2024@vitstudent.ac.in',
          password: '123456',
        });
        if (!error && data?.session) {
          setSession(data.session);
          setUser(data.user);
        }
        // If sign-in fails (user may not exist yet), stay logged out
      }
      setLoading(false);
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
<<<<<<< HEAD
    // Auto-confirm the user email for development
    if (data.user) {
      try {
        await apiFetch('/confirm-user', {
          method: 'POST',
          body: JSON.stringify({ userId: data.user.id }),
        });
      } catch (confirmError) {
        console.warn('Failed to auto-confirm user:', confirmError);
        // Don't throw, as sign up succeeded
      }
    }
=======
>>>>>>> 5e98ea98945641a4596e1a4cbf8358e5f96d8908
    return data;
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getAccessToken: () => session?.access_token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
