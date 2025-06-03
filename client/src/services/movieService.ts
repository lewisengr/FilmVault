import { Movie } from "../types/Movie";
import { get } from "../utils/api";

export const fetchMovieById = async (
  movieId: number,
  token?: string
): Promise<Movie | null> => {
  try {
    const data = await get<Movie>(`/movies/${movieId}`, token);

    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      posterPath: data.posterPath ?? null,
      voteAverage: data.voteAverage ?? 0,
      releaseDate: data.releaseDate ?? null,
      fullPosterPath: data.posterPath
        ? `https://image.tmdb.org/t/p/w500${data.posterPath}`
        : "",
    };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
