import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextInstance";

/**
 * AuthProvider component to manage authentication state.
 * It initializes the token from localStorage and provides
 * methods to set the token and check loading state.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setTokenState(storedToken);
    setLoading(false);
  }, []);

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};