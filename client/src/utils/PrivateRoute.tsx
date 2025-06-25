import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";

/**
 * PrivateRoute component to protect routes that require authentication.
 * It checks if the user is authenticated and either renders the children
 * or redirects to the login page.
 */
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
