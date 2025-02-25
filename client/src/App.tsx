import { useState } from "react";
import "./App.css";
import MovieDetails from "./components/MovieDetails";

function App() {
  const [movieId, setMovieId] = useState<number>(550); // Default to 550 - Fight Club

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = (
      event.currentTarget.elements.namedItem("movieId") as HTMLInputElement
    ).value;
    const parsedId = parseInt(input, 10);
    if (!isNaN(parsedId)) {
      setMovieId(parsedId);
    }
  };

  return (
    <div>
      <h1>Movie Details</h1>

      {/* Search Input */}
      <form onSubmit={handleSearch}>
        <input
          type="number"
          name="movieId"
          placeholder="Enter Movie ID"
          required
        />
        <button type="submit">Search</button>
      </form>

      {/* Movie Details */}
      <MovieDetails movieId={movieId} />
    </div>
  );
}

export default App;
