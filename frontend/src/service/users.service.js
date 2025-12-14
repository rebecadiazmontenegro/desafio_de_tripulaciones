const API_URL = import.meta.env.VITE_API_URL || "https://desafio-de-tripulaciones.onrender.com";



export const signUp = async (form, token) => {
  try {
    const response = await fetch(`${API_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error en service:", error);
    return { ok: false, data: { msg: "Error en el servidor" } };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error en service:", error);
    return { ok: false, data: { message: "Error en el servidor" } };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("token");
  
  try {
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error en service:", error);
    return { ok: false, data: { message: "Error en el servidor" } };
  }
};
