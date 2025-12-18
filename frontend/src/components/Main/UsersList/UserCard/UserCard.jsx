import React from "react";
import Swal from "sweetalert2";
import { deleteUser } from "../../../../service/users.service";

const UserCard = ({ user, token, onDelete }) => {
  const handleDelete = async () => {
    if (!user?.email) {
      Swal.fire("Error", "Email del usuario no definido", "error");
      return;
    }

    if (!token) {
      Swal.fire("Error", "No tienes token válido", "error");
      return;
    }

    const result = await Swal.fire({
      title: `¿Seguro que quieres eliminar a ${user.nombre}?`,
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff0000b3",
      cancelButtonColor: "#061230",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const { ok, data } = await deleteUser(user.email, token);

      if (ok) {
        Swal.fire("Eliminado", `Usuario ${user.nombre} eliminado correctamente`, "success");
        onDelete(user.email);
      } else {
        Swal.fire("Error", data.msg || "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <section className="userCard">
      <h3>{user.nombre}</h3>
      <h4>{user.apellidos}</h4>
      {user.departamento && <p><strong>Departamento: </strong>{user.departamento}</p>}

      <button onClick={handleDelete} className="deleteUserButton">
        Borrar
      </button>
    </section>
  );
};

export default UserCard;
