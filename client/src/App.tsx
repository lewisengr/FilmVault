import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import React, { Suspense } from "react";
const AuthPage = React.lazy(() => import("./features/auth/AuthPage"));
const Dashboard = React.lazy(() => import("./features/dashboard/Dashboard"));
const Settings = React.lazy(() => import("./features/settings/Settings"));
const FindMoviesPage = React.lazy(
  () => import("./features/find/FindMoviesPage")
);
const WatchlistPage = React.lazy(
  () => import("./features/watchlist/WatchlistPage")
);
import PrivateRoute from "./utils/PrivateRoute";

/**
 * Main App component that sets up the routing and authentication context.
 * It uses React Router for navigation and lazy loading for performance.
 */
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <div>Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route
              path="/register"
              element={<AuthPage initialMode="register" />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/searchall" element={<FindMoviesPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
