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

const AdminDashboard = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <section className="adminDashboard">
      <h1>Bienvenido, {userName}</h1>
      <article className="infoPanel">
        <h2>Panel de Administrador</h2>
        <p>Gestiona usuarios, visualiza estadísticas y configura el sistema</p>
      </article>

      <article className="cardButtons">
        <button onClick={() => navigate("/users/list")}>
          <Users size={50} />
          <h3>Ver Usuarios</h3>
          <p>Administra la lista de usuarios</p>
        </button>

        <button onClick={() => navigate("/chat")}>
          <MessageCircle size={50} />
          <h3>Chat</h3>
          <p>Administra los proyectos activos</p>
        </button>
      </article>
      <aside className="createManagerButton">
        <button onClick={() => navigate("/signup")}>
          <UserPlus size={50} />
          <h3>Crear Manager</h3>
          <p>Registra nuevos usuarios en el sistema</p>
        </button>
   
        <button className="guideButton" onClick={() => navigate("/guia")}>
          <Info size={28} />
          <h3>Guía de uso</h3>
        </button>
      </aside>

      <article className="profileButtons">
        <button
          className="changePasswordButton"
          onClick={() => navigate("/change/password")}
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

export default AdminDashboard;
