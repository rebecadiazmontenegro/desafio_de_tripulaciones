import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
import { GraphOne, GraphTwo, GraphThree } from "./Graphics/Graphics";

const Home = () => {
  return (
    <section className="home">
      <div className="animated-graphics">
        <GraphOne />
        <GraphTwo />
        <GraphThree />
      </div>

      <h1>
        Tus datos, tus decisiones: consulta, analiza y visualiza al instante.
      </h1>
      <Link to="/login">
        <button className="logInButton">
          Inicia sesión
          <ArrowRightCircle />
        </button>
      </Link>
    </section>
  );
};

export default Home;