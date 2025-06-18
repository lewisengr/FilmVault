import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance";

/**
 *
 * @returns The current authentication context, providing access to the token and setToken function.
 */
export const useAuth = () => useContext(AuthContext);