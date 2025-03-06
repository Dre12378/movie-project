import React, {useEffect, useState} from 'react'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTION = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}
const App = () => {
    const [search, setSearch] = useState('');
    const [movie, setMovie] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [trendingMovie,setTrendingMovie] = useState([]);

    useDebounce(() => setDebounceSearch(search),1000, [search])

    const fetchMovies = async (query = '') => {
        setLoading(true);
      try{
          const endpoint = query ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}` :`${API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc` ;
          const response = await fetch(endpoint, API_OPTION);
          const data = await response.json();
          if(!response.ok){
              throw new Error("Could not fetch : " + data.error);
          }
          console.log(data);

          if(data.response=== 'false'){
              setError(data.ERROR || "Failed to fetch movies");
              setMovie([]);
              return;
          }
          setMovie(data.results || [0]);

          if(query && data.results.length > 0 ){
              await updateSearchCount(query, data.results[0]);
          }

      }
      catch(err){
        console.log("Error API:" + err);
      }
      finally {
          setLoading(false);
      }

    };

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            console.log("Trending Movies API Response:", movies); // Debugging
            setTrendingMovie(movies);
        }
        catch (error) {
            console.log("Error loading trending movies:", error.message);
            setTrendingMovie([]);
        }
    }

    useEffect(() => {
        fetchMovies(debounceSearch);

    },[debounceSearch])

    useEffect(() =>
    {
        loadTrendingMovies();
    },[]);

    return (
        <main>
            <div className="pattern"/>
                <div className="wrapper">
                    <header>
                    <img src="src/assets/hero.png" alt="banner"/>
                    <h1 >Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    </header>
                    {trendingMovie.length > 0 && (
                        <section className="trending">
                            <h2>Trending Movies</h2>
                            <ul>
                                {trendingMovie.map((movie, index) => (
                                    <li key={movie.$id}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title}/>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    <Search search={search} setSearch={setSearch}/>
                    <section className="all-movies">
                        <h2>All Movies</h2>
                        {loading ? (
                            <Spinner/> ) :
                            error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <ul>
                                    {movie.map((movie) => (
                                            <MovieCard key={movie.id} movie={movie}/>
                                            ))}

                                </ul>
                            )}
                    </section>
                </div>
        </main>
    )
}
export default App
