
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define user types
export type UserRole = 'admin' | 'student' | 'lawyer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin NPJ',
    email: 'admin@npj.edu.br',
    password: 'admin123',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    name: 'Estudante de Direito',
    email: 'estudante@npj.edu.br',
    password: 'student123',
    role: 'student' as UserRole,
  },
  {
    id: '3',
    name: 'Advogado Orientador',
    email: 'advogado@npj.edu.br',
    password: 'lawyer123',
    role: 'lawyer' as UserRole,
  },
  {
    id: '4',
    name: 'Cliente',
    email: 'cliente@email.com',
    password: 'client123',
    role: 'client' as UserRole,
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('npj_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('npj_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('npj_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('npj_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
