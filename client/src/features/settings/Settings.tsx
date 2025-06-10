import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";
import { useState } from "react";

export default function Settings() {
  const [showSidebar, setShowSidebar] = useState(false);

  type SettingsCardProps = {
    title: string;
    description: string;
  };

  function SettingsCard({ title, description }: SettingsCardProps) {
    return (
      <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition cursor-pointer">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
    bg-white shadow-md h-full w-[250px] z-40
    sm:relative sm:translate-x-0 sm:transition-none
    fixed top-0 left-0 transform transition-transform duration-300 ease-in-out
    ${showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
  `}
      >
        <Sidebar />
      </aside>
      <button
        onClick={() => setShowSidebar((prev) => !prev)}
        className="sm:hidden fixed top-[90px] left-4 z-50 bg-white shadow p-2 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Main content */}
      <div className="flex flex-col flex-grow">
        {/* Navbar */}
        <Navbar title="Settings" />

        {/* Settings content */}
        <main className="flex-grow p-10 bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SettingsCard
              title="Account Information"
              description="Update your name, email, or password."
            />
            <SettingsCard
              title="Notification Preferences"
              description="Manage when and how you get notified."
            />
            <SettingsCard
              title="Theme & Display"
              description="Choose between light or dark mode."
            />
            <SettingsCard
              title="Privacy Controls"
              description="Adjust your data sharing preferences."
            />
            <SettingsCard
              title="Connected Services"
              description="Manage linked Google or social accounts."
            />
            <SettingsCard
              title="Billing Settings"
              description="View invoices, plans, and payment methods."
            />
          </div>
        </main>
      </div>
    </div>
  );
}
