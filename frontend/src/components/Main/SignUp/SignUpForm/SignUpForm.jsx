import React, { useState } from "react";
import { signUp } from "../../../../service/users.service";

const SignUpAdminForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
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
    alert(`Usuario creado correctamente: ${form.nombre} ${form.apellidos}`);
  };

  return (
    <article className="signUpAdmin">
      <h2>Crear usuario</h2>
      {message && <p>{message}</p>}
      <form className="signUpAdminForm" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <label>Apellidos:</label>
        <input
          type="text"
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={form.password}
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
          <option value="relojes">Relojes inteligentes</option>
          <option value="portatiles">Portátiles</option>
          <option value="moviles">Móviles</option>
          <option value="accesorios">Accesorios</option>
        </select>

        <button type="submit">Crear usuario</button>
      </form>
    </article>
  );
};

export default SignUpAdminForm;
