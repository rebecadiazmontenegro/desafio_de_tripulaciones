import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../../../service/users.service";


const SignUpAdminForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    departamento: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const { ok, data } = await signUp(form, token);

    if (!ok) {
      setMessage(data.msg || "Error al crear el usuario");
      return;
    }

    setMessage(`${data.msg}`);
    alert(`Usuario creado correctamente: ${form.nombre} ${form.apellidos}. Se ha enviado la contraseña a ${form.email}`);

    navigate("/dashboard")
  };

  return (
    <article className="signUpAdmin">
      <h1>Crear usuario</h1>
      {message && <p>{message}</p>}
      <form className="signUpAdminForm" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          placeholder="Introduce tu nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <label>Apellidos:</label>
        <input
          type="text"
          placeholder="Introduce tus apellidos"
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="Introduce tu correo"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Selecciona un departamento:</label>
        <select
          name="departamento"
          value={form.departamento}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecciona el Departamento</option>
          <option value="ventas">Ventas</option>
        </select>

        <button type="submit">Crear usuario</button>
      </form>
    </article>
  );
};

export default SignUpAdminForm;
