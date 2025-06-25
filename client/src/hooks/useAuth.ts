import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance";

/**
 * Custom hook to access the authentication context.
 * @returns The current authentication context, providing access to the token and setToken function.
 */
export const useAuth = () => useContext(AuthContext);