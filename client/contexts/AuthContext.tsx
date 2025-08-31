import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  joinedDate?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (in a real app, this would be handled by backend)
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@library.com',
    password: 'admin123',
    name: 'Library Administrator',
    role: 'admin',
    joinedDate: '2023-01-15'
  },
  {
    id: '2', 
    email: 'user@library.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    joinedDate: '2023-03-20'
  },
  {
    id: '3',
    email: 'jane@library.com', 
    password: 'user123',
    name: 'Jane Smith',
    role: 'user',
    joinedDate: '2023-02-10'
  }
];

// Mock JWT token generation
const generateMockJWT = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Parse mock JWT token
const parseMockJWT = (token: string): User | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    // Find user by ID
    const user = mockUsers.find(u => u.id === payload.sub);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      joinedDate: user.joinedDate
    };
  } catch {
    return null;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('library_token');
    if (savedToken) {
      const parsedUser = parseMockJWT(savedToken);
      if (parsedUser) {
        setUser(parsedUser);
        setToken(savedToken);
      } else {
        // Token is invalid or expired
        localStorage.removeItem('library_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock database
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create user object (without password)
      const userObject: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        joinedDate: foundUser.joinedDate
      };

      // Generate mock JWT token
      const jwtToken = generateMockJWT(userObject);

      // Save to state and localStorage
      setUser(userObject);
      setToken(jwtToken);
      localStorage.setItem('library_token', jwtToken);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        role: 'user',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      // Add to mock database
      mockUsers.push(newUser);

      // Create user object (without password)
      const userObject: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        joinedDate: newUser.joinedDate
      };

      // Generate mock JWT token
      const jwtToken = generateMockJWT(userObject);

      // Save to state and localStorage
      setUser(userObject);
      setToken(jwtToken);
      localStorage.setItem('library_token', jwtToken);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('library_token');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo credentials for users
export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@library.com',
    password: 'admin123',
    role: 'Admin'
  },
  user: {
    email: 'user@library.com',
    password: 'user123',
    role: 'User'
  }
};
