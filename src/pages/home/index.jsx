import React, { useState, useEffect } from "react";
import "./index.css";
import { sendRequest } from "../../shared/http.util";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

const getMoviesFromRes = (data) => {
  const movies = Object.entries(data).reduce((acc, cur) => {
    const [, value] = cur;
    const [name, year, imgUrl] = value;
    acc = [
      ...acc,
      {
        name,
        year,
        imgUrl,
      },
    ];
    return acc;
  }, []);

  return movies;
};

const HomePage = () => {
  const [randomMovies, setRandomMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // const [isLoaded, setIsLoaded] = useState(false);

  /* fetch random movie list*/
  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await sendRequest("POST", "getRandom", null, null);
        const movies = getMoviesFromRes(response.data);
        setRandomMovies(movies);
        // setIsLoaded(true);
      } catch (err) {
        // setIsLoaded(true);
        setRandomMovies([]);
        throw err;
      }
    };

    fetchRandomMovies();
  }, []);

  return (
    <section className="home-wrapper">
      <h3>Do you like this movie?</h3>

      {randomMovies.map((movie, index) => {
        return (
          <div
            className="movie-wrapper"
            key={movie.name}
            style={{
              backgroundImage: `url(${movie.imgUrl})`,
              backgroundSize: "cover",
              display: index === activeIndex ? "block" : "none",
            }}
          >
            <div className="movie-info">
              <h4>
                {movie.name} ({movie.year})
              </h4>
              <CheckCircleOutlineRoundedIcon />
              <HighlightOffRoundedIcon />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default HomePage;
