import { useState, useEffect, createContext, useContext } from 'react';
import { BackendUser } from '@/integrations/backend/client';
import { backend } from '@/integrations/backend/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: BackendUser | null;
  session: { token: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    backend.getSession()
      .then(({ user }) => {
        setUser(user);
        setSession({ token: token });
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { token, user } = await backend.signUp(email, password, fullName);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setSession({ token });
      toast({ title: 'Welcome!', description: 'Account created successfully.' });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || 'Failed',
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await backend.signIn(email, password);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setSession({ token });
      toast({ title: 'Welcome back!', description: 'You have been successfully signed in.' });
      return { error: null };
    } catch (error: any) {
      toast({ title: 'Sign in failed', description: error.message || 'Failed', variant: 'destructive' });
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setSession(null);
    toast({ title: 'Signed out', description: 'You have been successfully signed out.' });
  };

  const reloadUser = async () => {
    try {
      const { user } = await backend.getSession();
      setUser(user);
    } catch (_) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      reloadUser
    }}>
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