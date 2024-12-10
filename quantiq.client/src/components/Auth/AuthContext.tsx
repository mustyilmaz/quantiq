import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  updateAuthStatus: (status: boolean, name: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userName: '',
  updateAuthStatus: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const updateAuthStatus = (status: boolean, name: string) => {
    setIsAuthenticated(status);
    setUserName(name);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 