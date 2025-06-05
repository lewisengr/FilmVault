import { Movie, RawMovie } from "../types/Movie";
import { get } from "../utils/api";

export const fetchMovieById = async (
  movieId: number,
  token?: string
): Promise<Movie | null> => {
  try {
    const raw = await get<RawMovie>(`/movies/${movieId}`, token);

    const movie: Movie = {
      id: raw.id,
      title: raw.title,
      overview: raw.overview,
      posterPath: raw.poster_path ?? null,
      voteAverage: raw.vote_average ?? 0,
      releaseDate: raw.release_date ?? null,
      fullPosterPath: raw.poster_path
        ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
        : null,
    };

    return movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
