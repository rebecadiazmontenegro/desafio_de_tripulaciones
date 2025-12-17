import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </>
  );
}

export default App;
