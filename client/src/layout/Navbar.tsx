import { useRef, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { useAuth } from "../hooks/useAuth";
import userAvatar from "../assets/1144760.png";

export const Navbar = ({ title }: { title?: string }) => {
  const { setToken } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    window.location.href = "/login";
  };

  return (
    <header className="w-full bg-white relative">
      <nav className="flex justify-between items-center w-full gap-4 py-4 px-4 sm:px-6 flex-wrap">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-700 truncate max-w-[200px]">
          {title}
        </h2>

        <div className="flex items-center gap-4 flex-grow justify-end">
          {/* Only show SearchBar on small screens and up */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>

          <div className="relative">
            <img
              // src="https://cdn.builder.io/api/v1/image/assets/TEMP/8cfcdbd633a4783969723fdd3517a1d9812d8321?placeholderIfAbsent=true&apiKey=0482add54957497c913c831a5e30795b" mine
              src={userAvatar}
              alt="User avatar"
              className="cursor-pointer w-[48px] sm:w-[60px] aspect-square rounded-full object-cover"
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50"
              >
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="h-px bg-slate-200 w-full" />

      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
