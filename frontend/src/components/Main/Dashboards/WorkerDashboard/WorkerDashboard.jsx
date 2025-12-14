import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Key, LogOut } from "lucide-react";

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
      <article>
        <h2>Panel de Trabajador</h2>
        <p>Gestiona tus tareas y visualiza tu progreso</p>
      </article>

      <article>
        <button onClick={() => navigate("/chat")}>
          <MessageCircle size={28} />
          <h3>Chat</h3>
          <p>Visualiza y completa tus tareas</p>
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

export default WorkerDashboard;