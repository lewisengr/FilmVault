import { NavigationItem } from "../components/NavigationItem";
import FilmVaultLogo from "../assets/Camera Logo.svg";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "../assets/DashboardIcon.png";
import WatchlistIcon from "../assets/WatchlistIcon.png";
import SearchIcon from "../assets/SearchIcon.png";
import SettingsIcon from "../assets/Settings.png";

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="relative flex flex-col items-center justify-start w-[250px] bg-white min-h-screen py-10 gap-10 shadow-md">
      <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
        <img src={FilmVaultLogo} alt="FilmVault logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold text-slate-800">FilmVault</h1>
      </Link>

      <div className="flex flex-col items-center gap-6 w-full mt-10">
        <Link to="/dashboard" className="w-full flex justify-center">
          <NavigationItem
            icon={DashboardIcon}
            label="Dashboard"
            isActive={currentPath === "/dashboard"}
          />
        </Link>

        <Link to="/watchlist" className="w-full flex justify-center">
          <NavigationItem
            icon={WatchlistIcon}
            label="Watchlist"
            isActive={currentPath === "/watchlist"}
          />
        </Link>

        <Link to="/searchall" className="w-full flex justify-center">
          <NavigationItem
            icon={SearchIcon}
            label="Find Movies"
            isActive={currentPath === "/searchall"}
          />
        </Link>

        <Link to="/settings" className="w-full flex justify-center">
          <NavigationItem
            icon={SettingsIcon}
            label="Settings"
            isActive={currentPath === "/settings"}
          />
        </Link>
      </div>

      <div className="absolute top-0 right-0 w-px h-full bg-slate-200" />
    </aside>
  );
};
