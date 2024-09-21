import { createContext, useContext } from "react";

type User = { id: string; username: string };

type AuthContextType = {
  signup: () => void;
  login: () => void;
  logout: () => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
  const { children } = props;

  // TODO
  const signup = () => {};

  const login = () => {};

  const logout = () => {};

  return (
    <AuthContext.Provider value={{ signup, login, logout, user: null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
