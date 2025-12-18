import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Key, LogOut, Info } from "lucide-react";

const WorkerDashboard = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <section className="workerDashboard">
      <h1>Bienvenido, {userName}</h1>
      <article className="infoPanel">
        <h2>Panel de Trabajador</h2>
        <p>Gestiona tus tareas y visualiza tu progreso</p>
      </article>

      <article className="workerButtons">
        <aside className="chatButtons">
        <button className="chatButton" onClick={() => navigate("/chat")}>
          <MessageCircle size={50} />
          <h3>Chat</h3>
          <p>Visualiza y completa tus tareas</p>
        </button>
        <button className="guideButton" onClick={() => navigate("/guia")}>
          <Info size={28} />
          <h3>Guía de uso</h3>
        </button>
        </aside>
        <aside className="profileButtons">
        <button
          className="changePasswordButton"
          onClick={() => navigate("/change/password")}
        >
          <Key size={24} />
          <h3>Cambiar Contraseña</h3>
        </button>
        <button className="logOutButton" onClick={handleLogout}>
          <LogOut size={24} />
          Cerrar Sesión
        </button>
        </aside>
      </article>
    </section>
  );
};

export default WorkerDashboard;
