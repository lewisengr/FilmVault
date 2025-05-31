import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import React from "react";
const CreateAccountPage = React.lazy(
  () => import("./features/auth/CreateAccountPage")
);
const Dashboard = React.lazy(() => import("./features/dashboard/Dashboard"));
const Login = React.lazy(() => import("./features/auth/LoginPage"));
const Settings = React.lazy(() => import("./features/settings/Settings"));
const FindMoviesPage = React.lazy(
  () => import("./features/find/FindMoviesPage")
);
const WatchlistPage = React.lazy(
  () => import("./features/watchlist/WatchlistPage")
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateAccountPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/searchall" element={<FindMoviesPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
