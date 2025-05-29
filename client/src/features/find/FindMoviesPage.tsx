import { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { Movie, RawMovie } from "../../types/Movie";
import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";
import { API_URL } from "../../utils/api";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const fetchMovies = useCallback(async () => {
    const sanitizedQuery = sanitizeInput(query);
    const endpoint = sanitizedQuery
      ? `${API_URL}/api/movies/search?query=${encodeURIComponent(
          sanitizedQuery
        )}&page=${page}&include_adult=true&language=en-US`
      : `${API_URL}/api/movies/popular?page=${page}`;

    const res = await fetch(endpoint);
    const data: RawMovie[] = await res.json();
    const mapped = data.map(mapRawToMovie);

    const sorted = [...mapped].sort((a, b) => {
      if (b.voteAverage === a.voteAverage) {
        return b.title.localeCompare(a.title);
      }
      return b.voteAverage - a.voteAverage;
    });

    setMovies((prev) => (page === 1 ? sorted : [...prev, ...sorted]));
    if (mapped.length === 0 || mapped.length < 10) setHasMore(false);
  }, [query, page]);

  const fetchSavedMoviesIds = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/savedmovies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const savedIds: number[] = await res.json();
      setAddedIds((prev) => [...new Set([...prev, ...savedIds])]);
    } else {
      console.error("Failed to fetch saved movies IDs");
    }
  }, []);
  useEffect(() => {
    fetchSavedMoviesIds();
  }, [fetchSavedMoviesIds]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setPage(1);
      setMovies([]);
      setHasMore(true);
      await fetchSavedMoviesIds(); // ensure saved IDs are fetched first
      await fetchMovies(); // then load movies based on the current query
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [fetchMovies, fetchSavedMoviesIds, query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setMovies([]);
    setHasMore(true);
    fetchMovies();
  };

  const handleAddMovie = async (id: number, title: string) => {
    if (addedIds.includes(id)) {
      toast.error(`"${title}" is already on your dashboard.`);
      return;
    }

    const res = await fetch(`${API_URL}/api/savedmovies/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      setAddedIds((prev) => [...prev, id]);
    } else if (res.status === 409) {
      // Optional: if server already checks for duplicate
      alert(`"${title}" is already saved.`);
    } else {
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

          <InfiniteScroll
            dataLength={movies.length}
            next={async () => {
              setPage((prev) => prev + 1);
              await fetchSavedMoviesIds(); // refresh in case user added new movies
            }}
            hasMore={hasMore}
            loader={<div className="text-center text-gray-500 mt-4"></div>}
            scrollThreshold={0.95}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-white rounded shadow p-2 flex flex-col items-center transition-opacity duration-700 opacity-0 animate-fade-in"
                >
                  <img
                    src={movie.fullPosterPath}
                    alt={movie.title}
                    loading="lazy"
                    title={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded"
                  />
                  <h3 className="mt-2 text-sm font-medium text-center">
                    {movie.title}
                  </h3>
                  <button
                    onClick={() => handleAddMovie(movie.id, movie.title)}
                    className={`mt-2 px-3 py-1 rounded text-sm font-semibold transition ${
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
          </InfiniteScroll>
        </main>
      </div>
    </div>
  );
};

export default FindMoviesPage;
