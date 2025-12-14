import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./App.css";
import Login from "./components/Main/Login";
import Dashboard from "./components/Main/Dashboards/Dashboards";
import ChangePassword from "./components/Main/ChangePassword";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />  {/* <-- AGREGA ESTA LÍNEA */}

          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />

      </Routes>
      </BrowserRouter>
        <Footer />
    </>
  );
}

export default App;
