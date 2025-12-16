import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users, BarChart2, MessageCircle, Key, LogOut } from "lucide-react";

const AdminDashboard = ({ userName }) => {
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
        <p>Admin</p>
      </article>
      <article>
        <h2>Panel de Administrador</h2>
        <p>Gestiona usuarios, visualiza estadísticas y configura el sistema</p>
      </article>

      <article>
        <button onClick={() => navigate("/signup")}>
           <UserPlus size={28} />
          <h3>Crear Manager</h3>
          <p>Registra nuevos usuarios en el sistema</p>
        </button>

        <button onClick={() => navigate("/users/list")}>
          <Users size={28} />
          <h3>Ver Usuarios</h3>
          <p>Administra la lista de usuarios</p>
        </button>

        <button onClick={() => navigate("/chat")}>
          <MessageCircle size={28} />
          <h3>Chat</h3>
          <p>Administra los proyectos activos</p>
        </button>
        <button onClick={() => navigate("/guia")}>
          <MessageCircle size={28} />
          <h3>Guia de uso</h3>
        </button>
      </article>
      <article>
        <button onClick={() => navigate("/change-password")}>
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

export default AdminDashboard;
