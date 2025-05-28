import { useEffect, useRef, useState } from "react";
import { getFullPosterUrl } from "../../utils/tmdb";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
}

export const MovieSearchModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (movieId: number) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Debounce API call after user stops typing for 300ms to avoid excessive requests
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const fetchSuggestions = async () => {
        setLoading(true);
        setError("");

        try {
          const res = await fetch(
            `https://localhost:7170/api/movies/search?query=${encodeURIComponent(
              query
            )}`
          );

          if (!res.ok) {
            setError("Failed to fetch results");
            setResults([]);
            return;
          }

          const data = await res.json();
          setResults(data || []);
        } catch (err) {
          console.error("Error fetching movie suggestions:", err);
          setError("An error occurred while searching");
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-700/25 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative">
        <h2 className="text-xl font-semibold mb-4">Search for a Movie</h2>

        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        {loading && <p className="text-sm text-gray-500 mb-3">Searching...</p>}
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* Visual Suggestions (First 3 Posters) */}
        <div className="flex justify-between gap-2 mb-4">
          {results.slice(0, 3).map((movie) => (
            <div key={movie.id} className="flex flex-col items-center">
              <img
                src={getFullPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-[100px] h-[150px] object-cover rounded shadow cursor-pointer hover:scale-105 transition"
                onClick={() => {
                  onAdd(movie.id);
                  onClose();
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};
