import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  changePassword,
  changePasswordFirstTime,
} from "../../../service/users.service";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromLogin = location.state?.email;
  const tempPassword = location.state?.tempPassword;
  const isTemporaryPassword = location.state?.isTemporaryPassword;

  const [formData, setFormData] = useState({
    currentPassword: tempPassword || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isFirstTimeChange, setIsFirstTimeChange] = useState(false);

  useEffect(() => {
    if (isTemporaryPassword && emailFromLogin) {
      setUserEmail(emailFromLogin);
      setIsFirstTimeChange(true);
      return;
    }

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(user);
      setUserEmail(userData.email);
      setIsFirstTimeChange(false);
    } catch (error) {
      console.error("Error al obtener email:", error);
      navigate("/login", { replace: true });
    }
  }, [emailFromLogin, isTemporaryPassword, navigate]);

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

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      setLoading(false);
      return;
    }

    try {
      let ok, data;

      if (isFirstTimeChange) {
        ({ ok, data } = await changePasswordFirstTime(
          userEmail,
          currentPassword,
          newPassword
        ));
      } else {
        ({ ok, data } = await changePassword(currentPassword, newPassword));
      }

      if (ok) {
        setSuccess(
          data.message || data.msg || "Contraseña actualizada correctamente"
        );

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          if (isFirstTimeChange) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", {
              replace: true,
              state: {
                message:
                  "Contraseña actualizada. Inicia sesión con tu nueva contraseña.",
              },
            });
          } else {
            navigate("/dashboard", {
              replace: true,
            });
          }
        }, 2000);
      } else {
        setError(data.message || data.msg || "Error al cambiar la contraseña");
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Error al cambiar la contraseña. Verifica tu contraseña actual.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isFirstTimeChange) {
      setError("Debes cambiar tu contraseña temporal antes de continuar");
      return;
    }

    navigate("/dashboard");
  };

  if (!userEmail) {
    return (
      <section>
        <article>
          <p>Cargando...</p>
        </article>
      </section>
    );
  }

  return (
    <section className="changePassword">
      <article>
        <h1>
          {isFirstTimeChange
            ? "Cambio Obligatorio de Contraseña"
            : "Cambiar Contraseña"}
        </h1>
        <p>
          {isFirstTimeChange
            ? "Por seguridad, debes cambiar tu contraseña temporal"
            : "Actualiza tu contraseña por una más segura"}
        </p>
        {userEmail && <p className="user-email">Usuario: {userEmail}</p>}
      </article>

      <article>
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="success-message">
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <article>
            <label htmlFor="currentPassword">
              {isFirstTimeChange ? "Contraseña Temporal" : "Contraseña Actual"}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder={
                isFirstTimeChange
                  ? "Contraseña temporal recibida"
                  : "Introduce tu contraseña actual"
              }
              disabled={loading || !!tempPassword}
              required
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
              placeholder="Introduce tu nueva contraseña (mínimo 6 caracteres)"
              disabled={loading}
              required
              minLength={6}
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
              required
            />
          </article>

          <button type="submit" disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || isFirstTimeChange}
          >
            {isFirstTimeChange ? "No puedes cancelar" : "Cancelar"}
          </button>
        </form>
      </article>
    </section>
  );
};

export default ChangePassword;
