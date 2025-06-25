import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import React from "react";
import { AuthProvider } from "./context/AuthContext.tsx";

/**
 * Main entry point for the React application.
 * It renders the App component wrapped in AuthProvider for authentication context.
 */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
