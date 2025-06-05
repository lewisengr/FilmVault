import { useEffect, useState } from "react";
import { fetchMovieById } from "../../services/movieService";
import { Movie } from "../../types/Movie";

interface MovieDetailsProps {
  movieId: number;
  asCard?: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, asCard }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getMovie = async () => {
      const movieData = await fetchMovieById(movieId);
      if (movieData) {
        setMovie(movieData);
      }
    };

    getMovie();
  }, [movieId]);

  return movie ? (
    asCard ? (
      // Compact card view
      movie.fullPosterPath ? (
        <img
          src={movie.fullPosterPath}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover rounded-lg shadow-md"
        />
      ) : null
    ) : (
      // Modal detail view
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.fullPosterPath ?? ""}
          alt={movie.title}
          className="w-[200px] md:w-[250px] rounded-lg shadow"
        />
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {movie.title}
          </h2>
          <p className="text-sm text-slate-600 mb-4">{movie.overview}</p>
          <p className="text-sm">
            <strong>Rating:</strong> {movie.voteAverage.toFixed(1)}
          </p>
          <p className="text-sm">
            <strong>Release Date:</strong> {movie.releaseDate || "N/A"}
          </p>
        </div>
      </div>
    )
  ) : (
    <p className="text-sm text-gray-500">Loading movie details...</p>
  );
};

export default MovieDetails;
