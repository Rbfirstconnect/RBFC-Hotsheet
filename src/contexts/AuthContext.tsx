import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  user: { id?: string; email?: string; role?: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({}),
  logout: async () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ id?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', session.data.session.user.id)
        .single();

      if (userError) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      if (userData) {
        setIsAuthenticated(true);
        setUser({
          id: userData.id,
          email: userData.email
        });

        // Fetch user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userData.id)
          .single();

        if (roleData) {
          setUser(prev => ({ ...prev!, role: roleData.role }));
          setIsAdmin(roleData.role === 'admin');
        }
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, encrypted_password')
        .eq('email', email)
        .eq('encrypted_password', password)
        .single();

      if (userError || !userData) {
        return { error: 'Invalid email or password' };
      }

      setIsAuthenticated(true);
      setUser({
        id: userData.id,
        email: userData.email
      });

      // Fetch user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.id)
        .single();

      if (roleData) {
        setUser(prev => ({ ...prev!, role: roleData.role }));
        setIsAdmin(roleData.role === 'admin');
      }

      return {};
    } catch (err: any) {
      console.error('Login error:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};