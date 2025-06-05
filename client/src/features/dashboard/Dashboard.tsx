import { useEffect, useState } from "react";
import { AddMovieCard } from "../../components/AddMovieCard";
import { MovieSearchModal } from "./MovieSearchModal";
import MovieDetails from "./MovieDetails";
import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { Movie } from "../../types/Movie";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { get, post, del } from "../../utils/api";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [movieIds, setMovieIds] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const { token } = useAuth();
  const [pendingDeleteMovie, setPendingDeleteMovie] = useState<{
    id: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const ids = await get<number[]>("/savedmovies", token);
        setMovieIds(ids);

        const movieData = await Promise.all(
          ids.map((id) => get<Movie>(`/movies/${id}`))
        );
        setMovies(movieData.filter(Boolean));
      } catch (err) {
        console.error("Failed to load saved movies", err);
      }
    };

    if (token) fetchSavedMovies();
  }, [token]);

  const handleAddMovie = async (id: number) => {
    if (movieIds.includes(id)) return;

    try {
      await post(`/savedmovies/${id}`, {}, token);
      setMovieIds((prev) => [...prev, id]);

      const movie = await get<Movie>(`/movies/${id}`, token);
      if (movie) setMovies((prev) => [...prev, movie]);
    } catch (err) {
      console.error("Failed to add movie", err);
    }
  };

  const handleRemoveMovie = async (id: number) => {
    try {
      await del(`/savedmovies/${id}`, token);
      setMovieIds((prev) => prev.filter((movieId) => movieId !== id));
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error("Failed to remove movie", err);
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        return b.voteAverage - a.voteAverage;
      case "recent":
        return (
          new Date(b.releaseDate || 0).getTime() -
          new Date(a.releaseDate || 0).getTime()
        );
      case "az":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[250px] bg-white shadow-md h-full">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-grow h-full">
        <Navbar title="Overview" />

        <main className="flex-grow overflow-y-auto bg-gradient-to-b bg-slate-100 p-10">
          <div className="flex justify-end mb-6">
            <div>
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
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {sortedMovies.map((movie) => (
              <div
                key={movie.id}
                title={movie.title}
                className="relative group transition-transform hover:scale-105 max-w-[300px] cursor-pointer animate-fade-in"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDeleteMovie({ id: movie.id, title: movie.title });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2.5 py-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                  title="Remove movie"
                >
                  X
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
          onClose={() => setShowModal(false)}
          onAddToDashboard={handleAddMovie}
          onAddToWatchlist={() => {}}
        />
      )}

      {selectedMovieId !== null && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-700/25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full flex gap-6 relative">
            <button
              className="absolute top-4 right-4 text-xl font-bold text-indigo-700 hover:text-indigo-900"
              onClick={() => setSelectedMovieId(null)}
            >
              ×
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

export default Dashboard;
