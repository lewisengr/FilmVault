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
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const { token } = useAuth();

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

    const sorted = [...mapped].sort((a, b) => {
      if (b.voteAverage === a.voteAverage) {
        return b.title.localeCompare(a.title);
      }
      return b.voteAverage - a.voteAverage;
    });

    setMovies(sorted);
  }, [query]);

  const fetchSavedMoviesIds = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/savedmovies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch saved movies: ${res.status}`);
        return;
      }

      const savedIds: number[] = await res.json();
      setAddedIds(savedIds);
    } catch (error) {
      console.error("Error fetching saved movie IDs:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSavedMoviesIds();
    }
  }, [fetchSavedMoviesIds, token]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (token) {
        await fetchSavedMoviesIds();
      }
      await fetchMovies();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query, fetchMovies, fetchSavedMoviesIds, token]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchMovies();
  };

  const handleAddMovie = async (id: number) => {
    if (addedIds.includes(id)) return;

    try {
      await post(`/savedmovies/${id}`, {}, token);
      setAddedIds((prev) => [...prev, id]);
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("An error occurred while saving the movie.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[250px] bg-white shadow-md h-full">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-grow h-full">
        <Navbar title="Find Movies" />

        <main className="flex-grow overflow-y-auto bg-gradient-to-b bg-slate-100 p-10">
          <form onSubmit={handleSearch} className="mb-6 max-w-xl">
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
                <img
                  src={movie.fullPosterPath ?? ""}
                  alt={movie.title}
                  loading="lazy"
                  title={movie.title}
                  className="w-full aspect-[2/3] object-cover rounded"
                />
                <h3 className="mt-2 text-sm font-medium text-center">
                  {movie.title}
                </h3>
                <button
                  onClick={() => handleAddMovie(movie.id)}
                  className={`mt-2 px-3 py-1 rounded text-sm font-semibold transition cursor-pointer ${
                    addedIds.includes(movie.id)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  disabled={addedIds.includes(movie.id)}
                >
                  {addedIds.includes(movie.id) ? "Added" : "Add"}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindMoviesPage;
