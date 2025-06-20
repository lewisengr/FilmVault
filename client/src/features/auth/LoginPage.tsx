import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MovieImageBG from "../../assets/MoviesImageBG.png";
import FilmVaultLogo from "../../assets/Camera Logo.svg";
import { post } from "../../utils/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await post<{ token: string }>("/auth/login", {
        email,
        password,
      });

      setToken(data.token);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Try agian.");
      }
    }
  };

  return (
    <div className="relative flex h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${MovieImageBG})`, filter: "blur(1px)" }}
      />

      <div className="relative z-10 flex w-full justify-center items-center px-4">
        <div className="bg-white bg-opacity-95 rounded-xl p-8 sm:p-10 w-full max-w-[460px] sm:w-[460px]">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-4xl font-bold text-indigo-800">FilmVault</h1>
            <img
              src={FilmVaultLogo}
              alt="FilmVault logo"
              className="w-10 h-10"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6 italic">
            Log In to Your Account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500 mt-1 mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
