import { ReactNode, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: ReactNode;
};

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void;
};

const initialValue = {
  authenticated: false,
  setAuthenticated: () => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(() => {
    // Check State
    const storedAuthState = localStorage.getItem("authenticated");
    return storedAuthState === "true";
  });

  const navigate = useNavigate();

  // Update LocalStorage
  useEffect(() => {
    localStorage.setItem("authenticated", authenticated.toString());
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

//In console : localStorage.getItem("authenticated")