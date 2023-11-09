import axios from "axios";
import { ReactNode, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: ReactNode;
};

export type IUser = {
  id: number;
  email: string;
  nickname?: string | null;
  avatar?: string | null;
  hash: string;
};

type IAuthContext = {
  authenticated: boolean;
  user: IUser | null; 
  setAuthenticated: (newState: boolean) => void;
};

const initialValue = {
  authenticated: false,
  user: null,
  setAuthenticated: () => {},
};

//TODO Recyperer le JWT https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03
//https://www.permify.co/post/jwt-authentication-in-react/
const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(() => {
    // Check State
    const storedAuthState = localStorage.getItem("authenticated");
    return storedAuthState === "true";
  });

  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Erreur utilisateur", error);
      }
    };

    if (authenticated) {
      fetchUserData();
    }
  }, [authenticated]);

  // Update LocalStorage
  useEffect(() => {
    localStorage.setItem("authenticated", authenticated.toString());
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, user, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

//In console : localStorage.getItem("authenticated")