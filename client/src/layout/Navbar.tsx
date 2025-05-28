import { useRef, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { useAuth } from "../hooks/useAuth";

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
      <nav className="flex justify-between items-center w-full gap-6 py-4 px-6">
        <h2 className="text-3xl font-medium text-slate-700">{title}</h2>

        <div className="flex items-center gap-4 flex-grow justify-end relative">
          <SearchBar />

          <div className="relative">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8cfcdbd633a4783969723fdd3517a1d9812d8321?placeholderIfAbsent=true&apiKey=0482add54957497c913c831a5e30795b"
              alt="User avatar"
              className="cursor-pointer w-[60px] aspect-square rounded-full object-cover"
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
