import "./App.css";
import MovieDetails from "./components/MovieDetails.js";

function App() {
  return (
    <div>
      <h1>Movie Details</h1>
      <MovieDetails movieId={550} /> {/* Fetch Fight Club by default */}
    </div>
  );
}

export default App;
