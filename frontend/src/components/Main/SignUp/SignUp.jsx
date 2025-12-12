import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm/SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole = payload.rol;
        if (userRole === "admin" || userRole === "manager") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error al verificar autorización:", error);
        navigate("/login", { replace: true });
      }
    };

    checkAuthorization();
  }, [navigate]);

  if (isAuthorized === null) {
    return <p>Verificando permisos...</p>;
  }
  if (isAuthorized === false) {
    return (
      <div>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }
  return (
    <section>
      <SignUpForm />
    </section>
  );
};

export default SignUp;
