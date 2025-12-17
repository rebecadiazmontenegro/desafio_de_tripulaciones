import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../service/users.service";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validación básica
    if (!email) {
      setError("El email es requerido");
      setLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      setLoading(false);
      return;
    }

    try {
      const { ok, data } = await forgotPassword(email);

      if (ok) {
        setSuccess(
          data.message || 
          "Se ha enviado un email con instrucciones para restablecer tu contraseña"
        );
        setEmail("");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Error al procesar la solicitud");
      }
    } catch (err) {
      console.error("Error al solicitar restablecimiento:", err);
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forgotPassword">
      <article className="forgotPasswordContainer">
        <h1>¿Olvidaste tu contraseña?</h1>
        <p>
          Introduce tu email y te enviaremos una contraseña temporal para que
          puedas acceder y cambiarla.
        </p>

        {error && (
          <div className="errorMessage">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="successMessage">
            <p>{success}</p>
            <p>
              Revisa tu bandeja de entrada (y spam)
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu correo"
              disabled={loading || success}
              required
            />
          </div>

          <button type="submit" disabled={loading || success}>
            {loading ? "Enviando..." : "Enviar email de recuperación"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Volver al login
          </button>
        </form>
      </article>
    </section>
  );
};

export default ForgotPassword;