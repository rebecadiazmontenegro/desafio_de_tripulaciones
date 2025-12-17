import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { GraphOne, GraphTwo, GraphThree } from "./GraphicLogin/GraphicLogin";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole = payload.rol;

        if (userRole === "admin" || userRole === "manager") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error al verificar token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  return (
    <section className="login-section" style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>

      <div className="animated-graphics">
        <GraphOne />
        <GraphTwo />
        <GraphThree />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
