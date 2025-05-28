import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextInstance";

/**
 * AuthProvider component to manage authentication state
 * and provide token management functionality.
 *
 * This component initializes the token from localStorage
 * and provides a method to update the token, which also
 * updates localStorage.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize token state from localStorage or empty string
  const [token, setTokenState] = useState(
    () => localStorage.getItem("token") || ""
  );

  // Effect to load the token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setTokenState(storedToken);
  }, []);

  // Function to set a new token and update localStorage
  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
