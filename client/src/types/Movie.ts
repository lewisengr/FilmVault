/**
 * Movie interface for representing movie data.
 * This interface is used throughout the application to ensure type safety
 */
export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
  fullPosterPath: string | null;
}

/**
 * RawMovie interface for representing raw movie data from the TMDb API.
 */
export interface RawMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string | null;
}
