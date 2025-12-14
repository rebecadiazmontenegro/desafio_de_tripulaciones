import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users, MessageCircle, Key, LogOut } from "lucide-react";

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
        <p>Manager</p>
      </article>
      <article>
        <h2>Panel de Manager</h2>
        <p>Gestiona tu equipo y supervisa proyectos</p>
      </article>

      <article>
        <button onClick={() => navigate("/signup")}>
          <UserPlus size={28} />
          <h3>Crear Worker</h3>
          <p>Registra nuevos usuarios en el sistema</p>
        </button>

        <button onClick={() => navigate("/users/list")}>
          <Users size={28} />
          <h3>Mi Equipo</h3>
          <p>Visualiza y gestiona tu equipo</p>
        </button>

        <button onClick={() => navigate("/chat")}>
          <MessageCircle size={28} />
          <h3>Chat</h3>
          <p>Administra los proyectos activos</p>
        </button>
      </article>
      <article>
        <button onClick={() => navigate("/change/password")}>
          <Key size={24} />
          <h3>Cambiar Contraseña</h3>
        </button>

        <button onClick={handleLogout}>
          <LogOut size={24} />
          Cerrar Sesión
        </button>
      </article>
    </section>
  );
};

export default ManagerDashboard;
