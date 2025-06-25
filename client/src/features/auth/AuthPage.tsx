import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { post } from "../../utils/api";
import MovieImageBG from "../../assets/MoviesImageBG.png";
import FilmVaultLogo from "../../assets/Camera Logo.svg";
import React from "react";

interface AuthPageProps {
  initialMode?: "login" | "register";
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setToken } = useAuth();

  // Effect to sync mode with the initialMode prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const isLogin = mode === "login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const data = await post<{ token: string }>(endpoint, payload);
      setToken(data.token);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    // In a real app with React Router, navigation would handle the mode change.
    // For this mock, we'll just toggle the state.
    setMode(isLogin ? "register" : "login");
    // To see the effect in a routed app, you would do:
    // navigate(isLogin ? '/register' : '/login');
  };

  return (
    <div className="relative flex h-screen w-full font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MovieImageBG})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 flex w-full justify-center items-center px-4">
        <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-[460px]">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-4xl font-bold text-indigo-800">FilmVault</h1>
            <img
              src={FilmVaultLogo}
              alt="FilmVault logo"
              className="w-10 h-10"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6 italic text-gray-700">
            {isLogin ? "Log In to Your Account" : "Create Your Account"}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full border-b-2 bg-transparent border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border-b-2 bg-transparent border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border-b-2 bg-transparent border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 font-medium text-center mt-1 mb-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : isLogin ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-indigo-600 font-medium hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
