import { useEffect, useState, useCallback } from "react";
import { Movie, RawMovie } from "../../types/Movie";
import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";
import { post } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE_URL } from "../../utils/api";

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

const sanitizeInput = (input: string) => input.replace(/[^\w\s]/gi, "").trim();

const FindMoviesPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [addedInfo, setAddedInfo] = useState<Record<number, string>>({});
  const [pendingMovie, setPendingMovie] = useState<Movie | null>(null);
  const { token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchMovies = useCallback(async () => {
    const sanitizedQuery = sanitizeInput(query);
    const endpoint = sanitizedQuery
      ? `${API_BASE_URL}/movies/search?query=${encodeURIComponent(
          sanitizedQuery
        )}&include_adult=true&language=en-US`
      : `${API_BASE_URL}/movies/popular`;

    const res = await fetch(endpoint);
    const data: RawMovie[] = await res.json();
    const mapped = data.map(mapRawToMovie);

    setMovies(mapped);
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query, fetchMovies]);

  useEffect(() => {
    const fetchSavedStatuses = async () => {
      if (!token) return;

      try {
        const [savedRes, watchlistRes] = await Promise.all([
          fetch(`${API_BASE_URL}/savedmovies`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/watchlist`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [savedIds, watchlistIds]: [number[], number[]] =
          await Promise.all([
            savedRes.ok ? savedRes.json() : [],
            watchlistRes.ok ? watchlistRes.json() : [],
          ]);

        const combined: Record<number, string> = {};
        for (const id of savedIds) combined[id] = "Vault";
        for (const id of watchlistIds) combined[id] = "Watchlist";

        setAddedInfo(combined);
      } catch (error) {
        console.error("Error fetching saved/watched movies:", error);
      }
    };

    fetchSavedStatuses();
  }, [token]);

  const confirmAddMovie = async (
    movie: Movie,
    type: "savedmovies" | "watchlist"
  ) => {
    try {
      await post(`/${type}/${movie.id}`, {}, token);
      setAddedInfo((prev) => ({
        ...prev,
        [movie.id]: type === "savedmovies" ? "Vault" : "Watchlist",
      }));
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("An error occurred while saving the movie.");
    }
    setPendingMovie(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
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

      <div className="flex flex-col flex-grow h-full">
        <Navbar title="Find Movies" />
        <main className="flex-grow overflow-y-auto bg-gradient-to-b bg-slate-100 p-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchMovies();
            }}
            className="mb-6 max-w-xl"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              className="border px-4 py-2 rounded w-full"
            />
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded shadow p-2 flex flex-col items-center transition-transform duration-300 hover:scale-[1.02] animate-fade-in"
              >
                {movie.fullPosterPath ? (
                  <img
                    src={movie.fullPosterPath}
                    alt={movie.title}
                    loading="lazy"
                    title={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}

                <h3 className="mt-2 text-sm font-medium text-center">
                  {movie.title}
                </h3>
                <button
                  onClick={() => setPendingMovie(movie)}
                  className={`mt-2 px-3 py-1 rounded text-sm font-semibold transition cursor-pointer ${
                    addedInfo[movie.id]
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  disabled={!!addedInfo[movie.id]}
                >
                  {addedInfo[movie.id]
                    ? `Added to ${addedInfo[movie.id]}`
                    : "Add"}
                </button>
              </div>
            ))}
          </div>

          {pendingMovie && (
            <div className="fixed inset-0 bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 text-center">
                  Add <strong>{pendingMovie.title}</strong> to:
                </h3>
                <div className="flex justify-around mt-4">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded cursor-pointer"
                    onClick={() => confirmAddMovie(pendingMovie, "savedmovies")}
                    title="Add to Vault"
                  >
                    Vault
                  </button>
                  <button
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded cursor-pointer"
                    onClick={() => confirmAddMovie(pendingMovie, "watchlist")}
                    title="Add to Watchlist"
                  >
                    Watchlist
                  </button>
                </div>
                <button
                  onClick={() => setPendingMovie(null)}
                  className="block mt-6 mx-auto text-sm text-gray-500 hover:underline cursor-pointer"
                  title="Cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindMoviesPage;
