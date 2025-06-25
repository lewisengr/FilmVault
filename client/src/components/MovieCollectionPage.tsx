import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Navbar } from "../layout/Navbar";
import MovieDetails from "../features/dashboard/MovieDetails";
import { AddMovieCard } from "./AddMovieCard";
import { MovieSearchModal } from "../features/dashboard/MovieSearchModal";
import { Movie, RawMovie } from "../types/Movie";
import { get, post, del } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

interface MovieCollectionPageProps {
  apiPath: string; // "/savedmovies" or "/watchlist"
  pageTitle: string; // "Overview" or "Watchlist"
  isWatchlist?: boolean;
}

/**
 * MovieCollectionPage component displays a collection of movies
 * fetched from the server, allowing users to sort, add, and remove movies.
 * @param param0 - Props for the MovieCollectionPage component.
 * @returns - A JSX element displaying a collection of movies with options to sort, add, and remove movies.
 */
const MovieCollectionPage = ({
  apiPath,
  pageTitle,
  isWatchlist,
}: MovieCollectionPageProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const mapRawToMovie = (raw: RawMovie): Movie => ({
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    voteAverage: raw.vote_average,
    releaseDate: raw.release_date,
    fullPosterPath: raw.poster_path
      ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
      : "",
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const ids = await get<number[]>(`/${apiPath}`, token);
        const fetched = await Promise.all(
          ids.map(async (id) => {
            const raw = await get<unknown>(`/movies/${id}`, token);
            return mapRawToMovie(raw as RawMovie);
          })
        );
        setMovies(fetched.filter(Boolean));
      } catch (err) {
        // console.error(`Failed to load ${apiPath}`, err);
        console.error("Something went wrong. Try again.", err);
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
      setSelectedMovie(null); // Close modal after removal
    } catch (err) {
      console.error(`Failed to remove from ${apiPath}`, err);
    }
  };

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      switch (sortOption) {
        case "rating":
          return (b.voteAverage ?? 0) - (a.voteAverage ?? 0);
        case "recent":
          return (
            new Date(b.releaseDate ?? "").getTime() -
            new Date(a.releaseDate ?? "").getTime()
          );
        case "az":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [movies, sortOption]);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`
      bg-white shadow-md h-full w-[250px] z-40
      fixed sm:relative sm:top-0 sm:left-0 top-[64px] left-0 
      transform transition-transform duration-300 ease-in-out
      ${showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
    `}
      >
        <Sidebar />
      </aside>
      {/* Toggle Button (moved down to avoid overlapping with title) */}
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

      <div className="flex flex-col flex-grow h-full">
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

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedMovies.map((movie) => (
              <div
                key={movie.id}
                title={movie.title}
                onClick={() => setSelectedMovie(movie)}
                className="bg-white rounded shadow p-2 flex flex-col items-center transition-transform duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in"
              >
                <MovieDetails movieId={movie.id} asCard />
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

      {selectedMovie && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-700/25 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col gap-6 relative">
            <button
              className="absolute top-4 right-4 text-xl font-bold text-indigo-700 hover:text-indigo-900"
              onClick={() => setSelectedMovie(null)}
            >
              x
            </button>

            <MovieDetails movieId={selectedMovie.id} />
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="border border-red-600 text-red-600 font-semibold py-2 px-4 rounded hover:bg-red-50 transition cursor-pointer"
              >
                Remove Movie
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmDelete && selectedMovie && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Remove <span className="font-bold">{selectedMovie.title}</span>?
            </h3>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="text-sm text-gray-600 hover:underline  cursor-pointer"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleRemoveMovie(selectedMovie.id);
                  setShowConfirmDelete(false);
                }}
                className="border border-red-600 text-red-600 px-4 py-1.5 rounded font-semibold hover:bg-red-50 transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCollectionPage;
