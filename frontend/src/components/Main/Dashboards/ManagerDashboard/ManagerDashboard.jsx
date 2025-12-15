import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Users,
  MessageCircle,
  Key,
  LogOut,
  Info,
} from "lucide-react";

const ManagerDashboard = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <section className="managerDashboard">
      <h1>Bienvenido, {userName}</h1>
      <article className="infoPanel">
        <h2>Panel de Manager</h2>
        <p>Gestiona tu equipo y supervisa proyectos</p>
      </article>

      <article className="cardButtons">
        <aside className="chatTeam">
          <button
            className="teamButton"
            onClick={() => navigate("/users/list")}
          >
            <Users size={50} />
            <h3>Mi Equipo</h3>
            <p>Visualiza y gestiona tu equipo</p>
          </button>
          <button className="chatButton" onClick={() => navigate("/chat")}>
            <MessageCircle size={50} />
            <h3>Chat</h3>
            <p>Administra los proyectos activos</p>
          </button>
        </aside>

        <aside className="createManagerButton">
          <button className="createButton" onClick={() => navigate("/signup")}>
            <UserPlus size={50} />
            <h3>Crear Worker</h3>
            <p>Registra nuevos usuarios en el sistema</p>
          </button>
          <button className="guideButton" onClick={() => navigate("/guide")}>
            <Info size={28} />
            <h3>Guía de uso</h3>
          </button>
        </aside>
      </article>
      <article className="profileButtons">
        <button
          className="changePasswordButton"
          onClick={() => navigate("/change-password")}
        >
          <Key size={20} />
          <h4>Cambiar Contraseña</h4>
        </button>
        <button className="logOutButton" onClick={handleLogout}>
          <LogOut size={24} />
          Cerrar Sesión
        </button>
      </article>
    </section>
  );
};

export default ManagerDashboard;
