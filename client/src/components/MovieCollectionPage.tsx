import { useEffect, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Navbar } from "../layout/Navbar";
import MovieDetails from "../features/dashboard/MovieDetails";
import { AddMovieCard } from "./AddMovieCard";
import { MovieSearchModal } from "../features/dashboard/MovieSearchModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Movie } from "../types/Movie";
import { get, post, del } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

interface MovieCollectionPageProps {
  apiPath: string; // "/savedmovies" or "/watchlist"
  pageTitle: string; // "Overview" or "Watchlist"
  isWatchlist?: boolean;
}

const MovieCollectionPage = ({
  apiPath,
  pageTitle,
  isWatchlist,
}: MovieCollectionPageProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [pendingDeleteMovie, setPendingDeleteMovie] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const { token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const ids = await get<number[]>(`/${apiPath}`, token);
        const fetched = await Promise.all(
          ids.map((id) => get<Movie>(`/movies/${id}`, token))
        );
        setMovies(fetched.filter(Boolean));
      } catch (err) {
        console.error(`Failed to load ${apiPath}`, err);
      }
    };

    if (token) loadMovies();
  }, [token, apiPath]);

  const handleAddMovie = async (movieId: number) => {
    if (movies.find((m) => m.id === movieId)) return;

    try {
      await post(`/${apiPath}/${movieId}`, {}, token);
      const movie = await get<Movie>(`/movies/${movieId}`, token);
      setMovies((prev) => [...prev, movie]);
    } catch (error) {
      console.error(`Error adding to ${apiPath}:`, error);
    }
  };

  const handleRemoveMovie = async (id: number) => {
    try {
      await del(`/${apiPath}/${id}`, token);
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error(`Failed to remove from ${apiPath}`, err);
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortOption) {
      case "rating": {
        const ratingA = a.voteAverage ?? 0;
        const ratingB = b.voteAverage ?? 0;
        return ratingB - ratingA;
      }
      case "recent": {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return dateB - dateA;
      }
      case "az":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (responsive toggle) */}
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

      <div className="flex flex-col flex-grow h-full">
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="sm:hidden absolute top-4 left-4 z-50 bg-white shadow p-2 rounded"
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

        <Navbar title={pageTitle} />
        <main className="flex-grow overflow-y-auto bg-gradient-to-b bg-slate-100 p-10">
          <div className="flex justify-end mb-6">
            <label className="mr-2 text-sm font-medium text-slate-700">
              Sort by:
            </label>
            <select
              className="border rounded px-3 py-1 text-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="rating">Highest Rating</option>
              <option value="recent">Most Recent</option>
              <option value="az">A-Z</option>
            </select>
          </div>

          {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6"> */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedMovies.map((movie) => (
              <div
                key={movie.id}
                title={movie.title}
                className="bg-white rounded shadow p-2 flex flex-col items-center transition-transform duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in relative group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDeleteMovie({ id: movie.id, title: movie.title });
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-2.5 py-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remove movie"
                >
                  x
                </button>

                <div onClick={() => setSelectedMovieId(movie.id)}>
                  <MovieDetails movieId={movie.id} asCard />
                </div>
              </div>
            ))}

            <div className="max-w-[300px]">
              <AddMovieCard onClick={() => setShowModal(true)} />
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <MovieSearchModal
          isWatchlist={isWatchlist}
          onClose={() => setShowModal(false)}
          onAddToDashboard={isWatchlist ? () => {} : handleAddMovie}
          onAddToWatchlist={isWatchlist ? handleAddMovie : () => {}}
        />
      )}

      {selectedMovieId !== null && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-700/25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full flex gap-6 relative">
            <button
              className="absolute top-4 right-4 text-xl font-bold text-indigo-700 hover:text-indigo-900"
              onClick={() => setSelectedMovieId(null)}
            >
              x
            </button>
            <MovieDetails movieId={selectedMovieId} />
          </div>
        </div>
      )}

      {pendingDeleteMovie && (
        <ConfirmDeleteModal
          movieTitle={pendingDeleteMovie.title}
          onCancel={() => setPendingDeleteMovie(null)}
          onConfirm={() => {
            handleRemoveMovie(pendingDeleteMovie.id);
            setPendingDeleteMovie(null);
          }}
        />
      )}
    </div>
  );
};

export default MovieCollectionPage;
