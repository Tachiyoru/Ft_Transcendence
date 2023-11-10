// AuthProvider.tsx
import { createContext, ReactNode, useEffect, useState } from 'react';

type AuthContextProps = {
  authenticated: string | null;
  setAuthenticated: (token: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type Props = {
  children?: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthenticatedContext = (token: string | null) => {
    console.log('Setting authenticated context with token:', token);
    setAuthenticated(token);
    if (token !== null) {
      localStorage.setItem('token', token);
      localStorage.setItem('authenticated', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('authenticated');
    }
  };

  const logout = () => {
    setAuthenticatedContext(null);
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage on reload:', token);
      setAuthenticated(token);
      setLoading(false); 
    } catch (error) {
      console.error('Error setting authenticated context:', error);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated: setAuthenticatedContext, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider
