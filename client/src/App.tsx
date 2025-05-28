import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CreateAccountPage from "./features/auth/CreateAccountPage";
import Dashboard from "./features/dashboard/Dashboard";
import Login from "./features/auth/LoginPage";
import Settings from "./features/settings/Settings";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<CreateAccountPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
