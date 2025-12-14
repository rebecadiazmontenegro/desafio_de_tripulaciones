import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
      <Link to="/login">
          <button className="logInButton">Log In</button>
      </Link>
  );
};

export default Home;
