import React from "react";
import { Jumbotron, Button } from "react-bootstrap";
import { Parallax } from "react-scroll-parallax";
import { scrollToRef } from "./Navbar";

const Home = (props) => {
  return (
    <Parallax className="custom-class" y={[-20, 20]} tagOuter="figure">
      <div className="home-container">
        <Jumbotron className="jumbotron">
          <h1> Cat Coders </h1>{" "}
          <p>
            Highly skilled Software cats available for short term assignments.{" "}
          </p>{" "}
          <p>
            <Button
              onClick={() => scrollToRef(props.book)}
              className="jt-btn"
              variant="primary"
            >
              {" "}
              Book now{" "}
            </Button>{" "}
          </p>{" "}
        </Jumbotron>{" "}
      </div>{" "}
    </Parallax>
  );
};

export default Home;
