import React, { useState, useEffect, useRef } from "react";
import ChartRenderer from "./ChartRenderer/ChartRenderer";
import { sendChatQuery, getMessages } from "../../../service/chat.service";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState({});
  const messagesEndRef = useRef(null);
  // Guardamos Todo el historial Formateado
  const historyChat = useRef([]);
  // "Semáforo" para ver si estamos cargando el historial
  const isLoadingHistory = useRef(false);

  // Desempaquetamos JSON del Bot
  const parseMessage = (content) => {
    try {
      const parsed = JSON.parse(content);
      // Si los Datos son del Bot Devuelve el objeto limpio
      if(parsed && (parsed.type === 'data' || parsed.type === 'chart' || parsed.data)) {
        return parsed;
      }

      // Si se pudo parsear pero no es válida, devuelve null
      return null;

    }catch (e) {
      console.log(e)
      // Es texto normal
      return null; 
    }
  }

  // Efecto de Carga Inicial
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};
    setUserContext(user);

    const departamentoText = user.departamento
      ? ` con los datos de ${user.departamento.toUpperCase()}`
      : "";

      const welcomeMessage = {
        sender: "bot",
        text: `Hola, ${
          user.nombre ?? "Usuario"
        }. Soy el Chatbot interno. ¿En qué puedo ayudarte${departamentoText}?`,
      }

    // setMessages([
    //   {
    //     sender: "bot",
    //     text: `Hola, ${
    //       user.nombre ?? "Usuario"
    //     }. Soy el Chatbot interno. ¿En qué puedo ayudarte${departamentoText}?`,
    //   },
    // ]);

  // Función para pedir historial al Back
  const loadHistory = async () => {
    try {
      const history = await getMessages();
      
      // Traducir formatos Todo de Golpe
      const formatTranslation = history.map(dbMsg => {
        // Si es un JSON recoge la información, sino será null
        const data = parseMessage(dbMsg.message);

        // "Plan B" Si luego resulta que no es tabla ni gráfica, al menos tenemos texto para mostrar / Por defecto Texto Normal
        let botText = dbMsg.message;

        if(dbMsg.rol === 'bot'){
          if (data?.type === "data") {
            botText = `He encontrado ${data.data.rows.length} resultados.`;
          } else if (data?.type === "chart") {
            botText = `He generado un gráfico de tipo ${data.chart_type}.`;
          } else {
            botText = "Respuesta procesada.";
          }
      }
  
        return {
          // user o bot
          sender: dbMsg.rol,
          // Texto generado arriba
          text: botText,
          payload: data
        };
      });

      const finalHistoryChat = [welcomeMessage, ...formatTranslation];

      // Guardamos todo en la "Caja Fuerte"
      historyChat.current = finalHistoryChat;
      // Sacamos los últimos 10 de primeras
      const initialChat = finalHistoryChat.slice(-10);

      // Guardamos en el estado, Bienvenida e Historial Antiguo
      setMessages([ ...initialChat ]);
    } catch (error) {
            console.error("No se pudo cargar el historial", error);
        }
      }
    loadHistory();
  }, []);

  // Función para Manejar la Paginación
  const handlePages = () => {
    // Encendemos el Semáforo
    isLoadingHistory.current = true;
    // Calculamos Cuántos Mensajes hay en Pantalla, Quitando el de Bienvenida
    const currentVisible = messages.length - 1;

    // Mostrar 10 más
    const newCount = currentVisible + 10;
    // Sacamos un Trozo más grande de la Caja Fuerte
    const newMessages = historyChat.current.slice(-newCount);

    setMessages(newMessages);

    // setMessages(() => {
    //   // Mantener Mensaje de Bienvenida siempre arriba
    //   const welcome = b[0];
    //   return [ welcome, ...newMessages];
    // })
  }


  // Scroll Automático
  useEffect(() => {

    // Si el Semáforo está en Rojo: Significa que cargando el historial
    if(isLoadingHistory.current) {
      // Apagamos Semáforo para no hacer scroll
      isLoadingHistory.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enviar Mensaje
  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    const newUserMessage = { sender: "user", text: userMessage }
    setMessages((prev) => [...prev, newUserMessage ]);
    // Guardar mensaje para no perderlo al paginar
    historyChat.current.push(newUserMessage);

    try {
      const data = await sendChatQuery(userMessage);

      const payload = parseMessage(data.message);
      // Si payload existe, usamos ese para la lógica. Sino, usamos data directo
      const finalData = payload || data;

      let botText = "";
      if (finalData.type === "data") {
        botText = `He encontrado ${finalData.data.rows.length} resultados.`;
      } else if (finalData.type === "chart") {
        botText = `He generado un gráfico de tipo ${finalData.chart_type}.`;
      } else {
        // Si no es JSON complejo, es un mensaje de texto normal
        botText = finalData.message || "No he podido interpretar la respuesta.";
      }

      const newBotMessage = {
        sender: "bot",
        text: botText,
        // Guardamos los datos para pintar la gráfica
        payload: finalData
      }
      setMessages((prev) => [ ...prev, newBotMessage ]);
      historyChat.current.push(newBotMessage);
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
      {/* Mostrar botón si en la caja fuerte hay más mensajes de los que vemos */}
      { historyChat.current.length > messages.length && (
        <button onClick={handlePages}>Cargar Mensajes Anteriores</button>
      )}
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
