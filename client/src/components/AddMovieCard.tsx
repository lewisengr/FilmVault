/**
 *
 * @param param0 { onClick }: { onClick: () => void }
 * @description A component that renders a card for adding a movie.
 * It displays a plus sign inside a styled box and triggers the onClick function when clicked.
 */
export const AddMovieCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="w-full aspect-[2/3] rounded-lg shadow-md border-2 border-violet-400 border-dashed bg-violet-100 flex items-center justify-center cursor-pointer hover:shadow-lg transition duration-300 hover:bg-violet-200 active:scale-95"
    >
      <div className="bg-violet-600 rounded-xl p-5 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">+</span>
      </div>
    </div>
  );
};
