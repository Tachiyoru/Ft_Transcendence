// AuthProvider.tsx
import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userProfle = localStorage.getItem("userProfile");
    if (userProfle) {
      return JSON.parse(userProfle);
    }
    return null;
  }); 

  const navigate = useNavigate();

  const signup= async (payload) => {
    axios.post("http://localhost:5000/auth/signup", payload, {
      withCredentials: true,
    });

  const apiResponse = await axios.get("http://localhost:5000/hello", {
      withCredentials: true,
  });
  localStorage.setItem("userProfile", JSON.stringify(apiResponse.data));
  setUser(apiResponse.data);
  navigate("/");

  };
  
  return (
    <AuthContext.Provider value={{ user, signup }}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContext;

// import { createContext, ReactNode, useEffect, useState } from 'react';

// type AuthContextProps = {
//   authenticated: string | null;
//   setAuthenticated: (token: string | null) => void;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// type Props = {
//   children?: ReactNode;
// };

// export const AuthProvider = ({ children }: Props) => {
//   const [authenticated, setAuthenticated] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const setAuthenticatedContext = (token: string | null) => {
//     console.log('Setting authenticated context with token:', token);
//     setAuthenticated(token);
//     if (token !== null) {
//       localStorage.setItem('token', token);
//       localStorage.setItem('authenticated', token);
//     } else {
//       localStorage.removeItem('token');
//       localStorage.removeItem('authenticated');
//     }
//   };

//   const logout = () => {
//     setAuthenticatedContext(null);
//   };

//   useEffect(() => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Token from localStorage on reload:', token);
//       setAuthenticated(token);
//       setLoading(false); 
//     } catch (error) {
//       console.error('Error setting authenticated context:', error);
//     }
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ authenticated, setAuthenticated: setAuthenticatedContext, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider
