import { createContext } from "react";

type AuthContextType = {
  token: string;
  setToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: "",
  setToken: () => {},
});
