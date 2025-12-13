import {Link, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Link to="/signup">
        <button className="showProfileButton">
          SignUp
        </button>
      </Link>
        <Main />
      </BrowserRouter>
        <Footer />
    </>
  );
}

export default App;
