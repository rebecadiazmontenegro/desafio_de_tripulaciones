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
        // ✅ VERIFICAR SI NECESITA CAMBIAR CONTRASEÑA (PRIMERO)
        if (data.action === "FORCE_PASSWORD_CHANGE") {
          console.log("🔄 Usuario con contraseña temporal detectado");
          
          // Guardar token temporal si viene
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          
          // ⭐ Navegar a cambiar contraseña con los datos necesarios
          navigate("/change/password", {  // ← Corregido: guion, no slash
            state: { 
              email: data.user?.email || formData.email,
              tempPassword: formData.password,
              isTemporaryPassword: true
            }
          });
          return;  // ← IMPORTANTE: return para no continuar
        }

        // ✅ LOGIN NORMAL (si no necesita cambiar contraseña)
        console.log("✅ Login exitoso");
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Navegar al dashboard
        navigate("/dashboard", { replace: true });

      } else {
        setError(data.message || "Error en el login");
      }
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="loginContainer">
      
      <div className="loginHeader">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <form className="loginForm">
        {error && <div className="loginError">{error}</div>}
        
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

        <button 
            className="loginButton" 
            onClick={handleSubmit} 
            disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <button
          className="forgotButton"
          onClick={() => navigate("/forgot/password")}
          disabled={loading}
          type="button"
        >
          Olvidé mi contraseña
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
