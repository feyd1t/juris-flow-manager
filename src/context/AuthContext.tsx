import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define user types
export type UserRole = 'admin' | 'student' | 'lawyer' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent potential recursion issues
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(userProfile => {
          setProfile(userProfile);
        });
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect to appropriate page based on user role
  const redirectBasedOnRole = (role: UserRole) => {
    if (role === 'client') {
      navigate('/client/status');
    } else {
      navigate('/');
    }
  };

  // Sign up with email and password
  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      // Successful signup
      toast.success("Conta criada com sucesso!");
      
      if (data.session) {
        redirectBasedOnRole(role);
      } else {
        // Email confirmation required
        navigate('/login');
        toast.info("Confirme seu email para continuar");
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Exception during signup:', error);
      toast.error("Erro ao criar conta");
      setIsLoading(false);
      return false;
    }
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        // Don't consume the error here, throw it so the component can handle it
        throw error;
      }

      const userProfile = await fetchUserProfile(data.user.id);
      if (userProfile) {
        redirectBasedOnRole(userProfile.role as UserRole);
        toast.success("Login realizado com sucesso!");
      } else {
        console.error('User profile not found');
        toast.error("Perfil de usuário não encontrado");
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Exception during login:', error);
      setIsLoading(false);
      // Pass the error up to the calling component
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      toast.error("Erro ao fazer logout");
    } else {
      setUser(null);
      setProfile(null);
      setSession(null);
      navigate('/login');
      toast.success("Logout realizado com sucesso");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
