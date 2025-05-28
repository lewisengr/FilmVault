import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";

export default function Settings() {
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[250px] bg-white shadow-md">
        <Sidebar />
      </aside>

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
