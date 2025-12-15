import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Leemos lo que nos manda el login
  const emailFromLogin = location.state?.email;

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Si no hay email, LLevamos a login
  useEffect(() => {
    if(!emailFromLogin) {
      navigate("/login");
    }
  }, [ emailFromLogin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const urlChangePassword = `${import.meta.env.VITE_API_URL}/user/change-password`;
      const response = await axios.put(urlChangePassword, {
        email: emailFromLogin,
        defaultPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })

      // const { ok, data } = await changePassword(
      //   formData.currentPassword,
      //   formData.newPassword
      // );

      // if (response.ok) {
      //   setSuccess(response.data.message);
      //   setTimeout(() => {
      //     navigate("/login");
      //   }, 2000);
      // } else {
      //   setError(response.data.message || "Error al cambiar la contraseña");
      // }
      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <article>
        <h1>Cambiar Contraseña</h1>
        <p>Actualiza tu contraseña por una más segura</p>
      </article>

      <article>
        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div>
            <p>{success}</p>
          </div>
        )}

        <article>
          <label htmlFor="currentPassword">Contraseña Actual</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Introduce tu contraseña actual"
            disabled={loading}
          />
        </article>

        <article>
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Introduce tu nueva contraseña"
            disabled={loading}
          />
        </article>

        <article>
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirma tu nueva contraseña"
            disabled={loading}
          />
        </article>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>

        <button onClick={() => navigate("/login")} disabled={loading}>
          Cancelar
        </button>
      </article>
    </section>
  );
};

export default ChangePassword;