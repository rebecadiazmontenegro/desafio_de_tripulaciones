import React from "react";
import { deleteUser } from "../../../../service/users.service";

const UserCard = ({ user, token, onDelete }) => {
  const handleDelete = async () => {
    if (!user?.email) {
      alert("Email del usuario no definido");
      return;
    }

    if (!token) {
      alert("No tienes token válido");
      return;
    }

    if (!window.confirm(`¿Seguro que quieres eliminar a ${user.nombre}?`)) return;

    const { ok, data } = await deleteUser(user.email, token);

    if (ok) {
      alert(`Usuario ${user.nombre} eliminado correctamente`);
      onDelete(user.email);
    } else {
      alert(`Error: ${data.msg || "No se pudo eliminar"}`);
    }
  };

  return (
    <section className="userCard">
      <h4>{user.nombre}</h4>
      <p>{user.apellidos}</p>
      {user.departamento && <p>Departamento: {user.departamento}</p>}

      <button onClick={handleDelete} className="deleteUserButton">
        Borrar
      </button>
    </section>
  );
};

export default UserCard;
