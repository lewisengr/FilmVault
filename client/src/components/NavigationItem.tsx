interface NavigationItemProps {
  icon?: string;
  label: string;
  isActive?: boolean;
  customDropdown?: React.ReactNode;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  icon,
  label,
  isActive,
  customDropdown,
}) => {
  return (
    <div
      className={`flex items-center gap-4 px-7 py-4 rounded-xl w-[200px] transition ${
        isActive
          ? "bg-indigo-500 text-white font-semibold"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <img src={icon} alt={label} className="w-5 h-5 mr-2" />
      <span className="font-medium">{label}</span>
      {customDropdown && <span className="ml-2">{customDropdown}</span>}
    </div>
  );
};
