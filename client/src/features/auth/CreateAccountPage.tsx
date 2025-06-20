"use client";
import React from "react";
import MovieImageBG from "../../assets/MoviesImageBG.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FilmVaultLogo from "../../assets/Camera Logo.svg";
import { post } from "../../utils/api";

export const CreateAccountPage = () => {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      // using the post utility function
      const data = await post<{ token: string }>("/Auth/register", formData);

      const token = data.token;
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during registration. Try again.", error);
    }
  };

  return (
    <div className="relative flex h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage: `url(${MovieImageBG})`,
          filter: "blur(1px)",
        }}
      />

      {/* Overlayed form content */}
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
            Create Your Account
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 p-1"
              />
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Create Account
            </button>

            {/* SAVE FOR LATER to add Google sign-up */}
            {/* <button className="flex items-center justify-center w-full border border-gray-300 bg-gray-300 text-black py-3 rounded-xl gap-3 cursor-pointer transition hover:bg-gray-400">
              <img src={GoogleVector} alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button> */}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
