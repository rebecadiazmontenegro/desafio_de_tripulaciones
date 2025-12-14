import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../service/users.service";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email y contraseña son requeridos");
      setLoading(false);
      return;
    }

    try {
      const { ok, data } = await loginUser(formData.email, formData.password);

      if (ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según el rol
        if (data.user.rol === "admin" || data.user.rol === "manager") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setError(data.message || "Error en el login");
      }
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Iniciar Sesión</h1>
      <p>Ingresa tus credenciales para continuar</p>
      <form>
        {error && <div>{error}</div>}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Introduce tu correo"
          disabled={loading}
        />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Introduce tu contraseña"
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
        <button
          onClick={() => navigate("/forgot/password")}
          disabled={loading}
          type="button"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
