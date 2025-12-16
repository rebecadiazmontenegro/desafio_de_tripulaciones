import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { changePassword } from "../../../service/users.service"; // importa tu service

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const emailFromLogin = location.state?.email;

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Si no hay email, redirigir a login
  // useEffect(() => {
  //   if (!emailFromLogin) {
  //     navigate("/login");
  //   }
  // }, [emailFromLogin, navigate]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

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

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { ok, data } = await changePassword({ currentPassword, newPassword });

      if (ok) {
        setSuccess(data.message || "Contraseña actualizada correctamente");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Error al cambiar la contraseña");
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="changePassword">
      <article>
        <h1>Cambiar contraseña</h1>
        <p>Actualiza tu contraseña por una más segura</p>
      </article>

      <form className="changePasswordCard">
        {error && <div><p className="formMessageError" style={{ color: "red" }}>{error}</p></div>}
        {success && <div><p className="formMessageError" style={{ color: "green" }}>{success}</p></div>}

        <article className="formGroup">
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

        <article className="formGroup">
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

        <article className="formGroup">
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
        <article className="changePasswordButtons">
        <button className="submitButton" onClick={handleSubmit} disabled={loading}>
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
        <button className="cancelButton" onClick={() => navigate("/login")} disabled={loading}>
          Cancelar
        </button>
        </article>
      </form>
    </section>
  );
};

export default ChangePassword;
