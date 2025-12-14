import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import WorkerDashboard from "./WorkerDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user = JSON.parse(localStorage.getItem("user"));
      
      setUserRole(payload.rol);
      setUserName(user?.nombre || "Usuario");
    } catch (error) {
      console.error("Error al verificar token:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!userRole) {
    return (
      <section>
        <p>Cargando...</p>
      </section>
    );
  }

  switch (userRole) {
    case "admin":
      return <AdminDashboard userName={userName} />;
    case "manager":
      return <ManagerDashboard userName={userName} />;
    case "worker":
      return <WorkerDashboard userName={userName} />;
    default:
      return (
        <section>
          <h2>Rol no reconocido</h2>
          <button onClick={() => navigate("/login")}>
            Volver al login
          </button>
        </section>
      );
  }
};

export default Dashboard;