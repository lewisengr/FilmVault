import { createContext } from "react";

type AuthContextType = {
  token: string;
  setToken: (token: string) => void;
};

/**
 * AuthContext provides a way to manage authentication state
 * and token management across the application.
 */
export const AuthContext = createContext<AuthContextType>({
  token: "",
  setToken: () => {},
});
