import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard/UserCard";
import { getManagers, getWorkers } from "../../../service/users.service";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Token inválido:", err);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      let response;
      if (user.rol === "admin") {
        response = await getManagers(token);
      } else if (user.rol === "manager") {
        response = await getWorkers(token);
      } else {
        setError("No tienes permisos para ver usuarios");
        return;
      }

      if (response.ok) {
        setUsers(response.data);
      } else {
        setError(response.data.msg || "Error al cargar usuarios");
      }
    };

    fetchUsers();
  }, [user, token]);

  const handleDelete = (email) => {
    setUsers((prev) => prev.filter((u) => u.email !== email));
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>{user.rol === "admin" ? "Managers" : "Workers"}</h2>
      <article className="allUsers">
        {users.map((u) => (
          <UserCard
            key={u.email}
            user={u}
            token={token}
            onDelete={handleDelete}
          />
        ))}
      </article>
    </section>
  );
};

export default UsersList;
