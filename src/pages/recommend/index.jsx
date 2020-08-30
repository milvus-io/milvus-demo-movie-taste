import { Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./index.css";

const useStyles = makeStyles({
  card: {
    margin: "1rem",
    minHeight: "20vh",
  },
});

const RecommendPage = () => {
  const classes = useStyles();
  const [recommendMovies, setRecommendMovies] = useState([1, 1]);

  /* fetch recommend movie list */
  useEffect(() => {
    const fetchRecommendMovies = async () => {};
  });

  return (
    <section className="recommend-wrapper">
      <h3>Movie Recommendations</h3>

      {recommendMovies.map((movie) => {
        return (
          <Card className={classes.card}>
            <CardContent>Tesla(2017)</CardContent>
          </Card>
        );
      })}
    </section>
  );
};

export default RecommendPage;
