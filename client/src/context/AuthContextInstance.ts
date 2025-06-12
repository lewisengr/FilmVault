import { createContext } from "react";

export const AuthContext = createContext<{
  token: string;
  setToken: (token: string) => void;
  loading: boolean;
}>({
  token: "",
  setToken: () => {},
  loading: true,
});
