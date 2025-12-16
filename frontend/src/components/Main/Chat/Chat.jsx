import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChartRenderer from "./ChartRenderer/ChartRenderer";
import { sendChatQuery } from "../../../service/chat.service";

const Chat = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userContext, setUserContext] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (payload) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : {};
        setUserContext(user);

        const departamentoText = user.departamento
          ? ` con los datos de ${user.departamento.toUpperCase()}`
          : "";

        setMessages([
          {
            sender: "bot",
            text: `Hola, ${
              user.nombre ?? "Usuario"
            }. Soy el Chatbot interno. ¿En qué puedo ayudarte${departamentoText}?`,
          },
        ]);
      } catch (error) {
        console.error("Token inválido:", error);
        navigate("/login", { replace: true });
      }
    };

    checkAuthorization();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const data = await sendChatQuery(userMessage);

      let botText = "";
      if (data.type === "data") {
        botText = `He encontrado ${data.data.rows.length} resultados.`;
      } else if (data.type === "chart") {
        botText = `He generado un gráfico de tipo ${data.chart_type}.`;
      } else {
        botText = "No he podido interpretar la respuesta.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botText,
          payload: data,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al conectar con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized === null) {
    return <p>Verificando permisos...</p>;
  }
  if (isAuthorized === false) {
    return (
      <div>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder al chat.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <section>
      <h1>Tu chatbot</h1>
    <article className="chatArea">
      <aside className="messagesWindow">
        {messages.map((msg, index) => (
          <div key={index} className={`message-item ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "Tú:" : "Bot:"}</strong>
            <span> {msg.text}</span>

            {msg.sender === "bot" && msg.payload?.type === "chart" && (
              <div className="chartContainer">
                <ChartRenderer payload={msg.payload} />
              </div>
            )}

            {msg.sender === "bot" && msg.payload?.type === "data" && (
              <table className="dataTable">
                <thead>
                  <tr>
                    {msg.payload.data.columns.map((col, idx) => {
                      const nombresHumanos = {
                        date_trunc: "Fecha",
                        max_importe_total: "Importe total máximo",
                        total_importe_total: "Importe total",
                        promedio_importe_total: "Promedio importe total",
                        total_cantidad: "Cantidad total",
                        pais: "País",
                        conteo_transacciones: "Conteo de transacciones",
                      };
                      return <th key={idx}>{nombresHumanos[col] || col}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {msg.payload.data.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </aside>

      <form className="inputArea" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            loading ? "Esperando respuesta..." : "Escribe tu pregunta..."
          }
          disabled={loading}
        />
        <button className="submitButton" type="submit" disabled={loading}>
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </article>
      <button onClick={() => navigate(-1)}>
      Volver
    </button>
    </section>
  );
};

export default Chat;
