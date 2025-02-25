import { useState, useEffect } from "react";
import { fetchMovieById } from "../services/movieService.ts";

// Define the movie type
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
  fullPosterPath: string;
}

// Define the props type
interface MovieDetailsProps {
  movieId: number;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getMovie = async () => {
      const data = await fetchMovieById(movieId);
      setMovie(data);
    };
    getMovie();
  }, [movieId]);

  if (!movie)
    return <p className="text-center text-white">Loading movie details...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center">{movie.title}</h2>
      {movie.fullPosterPath && (
        <img
          src={movie.fullPosterPath}
          alt={movie.title}
          className="w-full rounded-lg mt-4"
        />
      )}
      <p className="mt-4">
        <strong>Release Date:</strong> {movie.releaseDate || "N/A"}
      </p>
      <p>
        <strong>Rating:</strong> {movie.voteAverage} / 10
      </p>
      <p className="mt-2">
        <strong>Overview:</strong> {movie.overview}
      </p>
    </div>
  );
};

export default MovieDetails;
