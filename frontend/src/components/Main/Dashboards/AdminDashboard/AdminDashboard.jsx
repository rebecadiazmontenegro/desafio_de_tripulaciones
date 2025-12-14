import React from "react";
import { useNavigate } from "react-router-dom";

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
        <span>Admin</span>
      </article>
      <button onClick={() => navigate("/change/password")}>
        <h3>Cambiar Contraseña</h3>
      </button>
      <article>
        <h2>Panel de Administrador</h2>
        <p>Gestiona usuarios, visualiza estadísticas y configura el sistema</p>
      </article>

      <article>
        <button onClick={() => navigate("/signup")}>
          <div>👥</div>
          <h3>Crear Manager</h3>
          <p>Registra nuevos usuarios en el sistema</p>
        </button>

        <button onClick={() => navigate("/users")}>
          <div>📊</div>
          <h3>Ver Usuarios</h3>
          <p>Administra la lista de usuarios</p>
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

export default AdminDashboard;