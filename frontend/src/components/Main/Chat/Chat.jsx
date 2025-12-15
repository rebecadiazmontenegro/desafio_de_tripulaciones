import React, { useState, useEffect, useRef } from "react";
import ChartRenderer from "./ChartRenderer/ChartRenderer";
import { sendChatQuery } from "../../../service/chat.service";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
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
  }, []);

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


  return (
    <div className="chat-area">
      <div className="messages-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-item ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "Tú:" : "Bot:"}</strong>
            <span> {msg.text}</span>

            {/* Render de gráficos */}
            {msg.sender === "bot" && msg.payload?.type === "chart" && (
              <div className="chart-container">
                <ChartRenderer payload={msg.payload} />
              </div>
            )}

            {/* Render de datos en tabla */}
            {msg.sender === "bot" && msg.payload?.type === "data" && (
              <table className="data-table">
                <thead>
                  <tr>
                    {msg.payload.data.columns.map((col, idx) => {
                      const nombresHumanos = {
                        date_trunc: "Fecha",
                        max_importe_total: "Importe total máximo",
                        total_importe_total: "Importe total",
                        promedio_importe_total: "Promedio importe total",
                        total_cantidad: "Cantidad total",
                        // agrega más alias si quieres
                      };
                      return <th key={idx}>{nombresHumanos[col] || col}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {msg.payload.data.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => {
                        const colName = msg.payload.data.columns[cIdx];

                        if (colName === "date_trunc") {
                          const fecha = new Date(cell);
                          return (
                            <td key={cIdx}>
                              {`${fecha
                                .getDate()
                                .toString()
                                .padStart(2, "0")}/${(fecha.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}/${fecha.getFullYear()}`}
                            </td>
                          );
                        }

                        if (typeof cell === "number") {
                          return <td key={cIdx}>{cell.toFixed(2)}</td>;
                        }

                        return <td key={cIdx}>{cell}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            loading ? "Esperando respuesta..." : "Escribe tu pregunta..."
          }
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default Chat;
