import React from "react";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = ({ userName }) => {
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
        <span>Worker</span>
      </article>
      <button onClick={() => navigate("/change/password")}>
        <h3>Cambiar Contraseña</h3>
      </button>
      <article>
        <h2>Panel de Trabajador</h2>
        <p>Gestiona tus tareas y visualiza tu progreso</p>
      </article>

      <article>
        <button onClick={() => navigate("/chat")}>
          <div>✓</div>
          <h3>CHAT</h3>
          <p>Visualiza y completa tus tareas</p>
        </button>

        <button onClick={() => navigate("/schedule")}>
          <div>📅</div>
          <h3>Mi Horario</h3>
          <p>Revisa tu horario de trabajo</p>
        </button>
      </article>

      <button onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </section>
  );
};

export default WorkerDashboard;