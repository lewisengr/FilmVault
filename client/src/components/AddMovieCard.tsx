export const AddMovieCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="w-full aspect-[2/3] rounded-lg shadow-md border-2 border-violet-400 border-dashed bg-violet-100 flex items-center justify-center cursor-pointer hover:shadow-lg transition"
    >
      <div className="bg-violet-600 rounded-xl p-4">
        <span className="text-white text-3xl font-bold">+</span>
      </div>
    </div>
  );
};
