import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está logueado, redirigir
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
    <section>
      <LoginForm />
    </section>
  );
};

export default Login;
