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
