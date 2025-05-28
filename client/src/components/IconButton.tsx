interface IconButtonProps {
  icon: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  alt,
  onClick,
  className,
}: IconButtonProps) => {
  return (
    <button
      className="flex gap-2.5 items-center self-stretch px-3 py-3.5 my-auto rounded-3xl bg-slate-100 h-[50px] w-[49px]"
      aria-label={alt}
      onClick={onClick}
    >
      <img
        src={icon}
        alt={alt}
        onClick={onClick}
        className={`w-6 h-6 ${className ?? ""}`}
      />
    </button>
  );
};
