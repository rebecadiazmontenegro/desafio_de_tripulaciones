import React from "react";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <section>
      <article>
        <h1>Bienvenido, {userName}</h1>
        <span>Manager</span>
      </article>
      <button onClick={() => navigate("/change/password")}>
        <h3>Cambiar Contraseña</h3>
      </button>
      <article>
        <h2>Panel de Manager</h2>
        <p>Gestiona tu equipo y supervisa proyectos</p>
      </article>

      <article>
        <button onClick={() => navigate("/signup")}>
          <div>👥</div>
          <h3>Crear Worker</h3>
          <p>Registra nuevos usuarios en el sistema</p>
        </button>

        <button onClick={() => navigate("/team")}>
          <div>👥</div>
          <h3>Mi Equipo</h3>
          <p>Visualiza y gestiona tu equipo</p>
        </button>

        <button onClick={() => navigate("/chat")}>
          <div>📋</div>
          <h3>CHAT</h3>
          <p>Administra los proyectos activos</p>
        </button>
      </article>

      <button onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </section>
  );
};

export default ManagerDashboard;