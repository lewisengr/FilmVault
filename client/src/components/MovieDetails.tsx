import { useEffect, useState } from "react";
import { fetchMovieById } from "../services/movieService";

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
  fullPosterPath: string;
}

interface MovieDetailsProps {
  movieId: number;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId }) => {
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

  return (
    <div>
      {movie ? (
        <>
          <h2>{movie.title}</h2>
          <p>
            <strong>Release Date:</strong> {movie.releaseDate || "N/A"}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"}
          </p>
          <p>{movie.overview}</p>
          {movie.fullPosterPath ? (
            <img src={movie.fullPosterPath} alt={movie.title} />
          ) : (
            <p>No poster available</p>
          )}
        </>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
};

export default MovieDetails;
