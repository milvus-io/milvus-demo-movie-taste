import React, { useState, useEffect } from 'react';
import './index.css';
import { sendRequest } from '../../shared/http.util';
// import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router';
import { getMoviesFromRes } from '../../shared/format.util';
import Loading from '../../components/Loading';

const useStyles = makeStyles({
  like: {
    color: '#3bb73b',
    marginRight: '3rem',
  },
  icon: {
    fontSize: '4rem',
  },
});

const HomePage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [randomMovies, setRandomMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedMovieIds, setLikedMovieIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchRandomMovies = async () => {
    try {
      const response = await sendRequest('POST', 'getRandom', null, null);
      const movies = getMoviesFromRes(response.data);
      setRandomMovies(movies);
      sessionStorage.setItem('randomMovies', JSON.stringify(movies));
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setRandomMovies([]);
      throw err;
    }
  };

  /* fetch random movie list*/
  useEffect(() => {
    const movies = sessionStorage.getItem('randomMovies');
    const activeIndex = sessionStorage.getItem('activeIndex');
    if (movies) {
      const randomMovies = JSON.parse(movies);
      setRandomMovies(randomMovies);
      const index = Number(activeIndex);
      setActiveIndex(index);
      setIsLoaded(true);
    } else {
      fetchRandomMovies();
    }
  }, []);

  const onLikeButtonClick = (event, id) => {
    event.stopPropagation();
    if (!likedMovieIds.includes(id)) {
      const movieIds = [...likedMovieIds, id];
      setLikedMovieIds(movieIds);
    }
    goToNextMovie();
  };

  const onDislikeButtonClick = (event) => {
    event.stopPropagation();
    goToNextMovie();
  };

  const onViewDetailClick = (movieId, index) => {
    history.push({
      pathname: '/detail',
      state: {
        id: movieId,
      },
    });

    sessionStorage.setItem('activeIndex', index);
  };

  const goToNextMovie = () => {
    /*
      the number of movies to test your taste is 16 
      so we use index 15 to decide whether jumping to recommend page
    */

    if (activeIndex < 15) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
    } else {
      submitLikedMovies(likedMovieIds);
    }
  };

  const submitLikedMovies = (ids) => {
    history.push({
      pathname: '/recommend',
      state: { ids },
    });
  };

  return (
    <section className="home-wrapper">
      <h3>Do you like this movie?</h3>
      {!isLoaded && <Loading />}

      {randomMovies.length > 0 &&
        randomMovies.map((movie, index) => {
          return (
            <div
              className="movie-wrapper"
              key={movie.name}
              onClick={() => {
                onViewDetailClick(movie.id, index);
              }}
              style={{
                display: index === activeIndex ? 'block' : 'none',
              }}
            >
              <img
                className="movie-poster"
                src={movie.imgUrl}
                alt="movie poster"
              />
              <div className="movie-info">
                <div className="movie-title">
                  {movie.name} ({movie.year})
                </div>
                <div className="movie-button">
                  <IconButton
                    className={classes.like}
                    onClick={(e) => onLikeButtonClick(e, movie.id)}
                  >
                    <CheckCircleIcon className={classes.icon} />
                  </IconButton>
                  <IconButton
                    className={classes.dislike}
                    color="secondary"
                    onClick={onDislikeButtonClick}
                  >
                    <CancelIcon className={classes.icon} />
                  </IconButton>
                </div>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default HomePage;
