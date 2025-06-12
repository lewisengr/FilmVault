import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
