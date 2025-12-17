import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChartRenderer from "./ChartRenderer/ChartRenderer";
import { sendChatQuery } from "../../../service/chat.service";
import {
  Download,
  FileText,
  BarChart2,
  Send,
  ArrowLeft,
  Info,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Chat = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [userContext, setUserContext] = useState({});

  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAuthorized(!!payload);

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : {};
        setUserContext(user);

        setMessages([
          {
            sender: "bot",
            text: `Hola, ${
              user.nombre ?? "Usuario"
            }. Soy el Chatbot interno. ¿Con qué datos puedo ayudarte?`,
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

  const formatBotResponse = (text) => {
    if (!text) return null;

    const hasTable = text.includes('|') && text.split('|').length > 5;
    
    if (hasTable) {
      return parseTableResponse(text);
    }

    const hasNumberedList = /\d+\.\s\*\*/.test(text) || /\d+\.\s[A-Z]/.test(text);
    if (hasNumberedList) {
      return parseNumberedList(text);
    }

    return parseFormattedText(text);
  };

  const parseTableResponse = (text) => {
    const lines = text.split('\n').filter(line => line.trim());

    const tableStart = lines.findIndex(line => line.includes('|') && line.split('|').length > 2);
    if (tableStart === -1) return <span>{text}</span>;

    const beforeTable = lines.slice(0, tableStart).join('\n');
    const tableLines = lines.slice(tableStart);
    
    const headerLine = tableLines[0];
    const separatorIndex = tableLines.findIndex(line => line.includes('---'));
    const dataLines = tableLines.slice(separatorIndex + 1).filter(line => line.includes('|'));
    
    const headers = headerLine.split('|')
      .map(h => h.trim())
      .filter(h => h);
    
    const rows = dataLines.map(line => 
      line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell)
    );

    const afterTableIndex = tableStart + separatorIndex + 1 + dataLines.length;
    const afterTable = lines.slice(afterTableIndex).join('\n');

    return (
      <div className="formatted-response">
        {beforeTable && <p className="response-intro">{beforeTable}</p>}
        
        <div className="response-table-wrapper">
          <table className="response-table">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {afterTable && <p className="response-summary">{afterTable}</p>}
      </div>
    );
  };

  const parseNumberedList = (text) => {
    const lines = text.split('\n');
    const result = [];
    let currentText = [];

    lines.forEach((line, idx) => {
      const isListItem = /^\d+\.\s/.test(line.trim());
      
      if (isListItem) {
        if (currentText.length > 0) {
          result.push(<p key={`text-${idx}`}>{currentText.join(' ')}</p>);
          currentText = [];
        }
        
        const match = line.match(/^(\d+)\.\s\*\*(.+?)\*\*:?\s*(.+)$/);
        if (match) {
          const [, num, label, value] = match;
          result.push(
            <div key={idx} className="list-item">
              <span className="list-number">{num}.</span>
              <strong className="list-label">{label}:</strong>
              <span className="list-value">{value}</span>
            </div>
          );
        } else {
          result.push(<p key={idx}>{line}</p>);
        }
      } else {
        currentText.push(line);
      }
    });

    if (currentText.length > 0) {
      result.push(<p key="text-final">{currentText.join(' ')}</p>);
    }

    return <div className="formatted-response">{result}</div>;
  };


  const parseInlineMarkdown = (text) => {
    const parts = [];
    let currentText = '';
    let i = 0;
    
    while (i < text.length) {

      if (text[i] === '*' && text[i + 1] === '*') {
        if (currentText) {
          parts.push(<span key={`text-${i}`}>{currentText}</span>);
          currentText = '';
        }
        
        const endIdx = text.indexOf('**', i + 2);
        if (endIdx !== -1) {
          const boldText = text.slice(i + 2, endIdx);
          parts.push(<strong key={`bold-${i}`}>{boldText}</strong>);
          i = endIdx + 2;
          continue;
        }
      }
      
      if (text[i] === '`' && text[i + 1] === '`' && text[i + 2] === '`') {
        if (currentText) {
          parts.push(<span key={`text-${i}`}>{currentText}</span>);
          currentText = '';
        }
        
        const endIdx = text.indexOf('```', i + 3);
        if (endIdx !== -1) {
          const codeText = text.slice(i + 3, endIdx);
          parts.push(
            <code key={`code-${i}`} style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '2px 6px', 
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em'
            }}>
              {codeText}
            </code>
          );
          i = endIdx + 3;
          continue;
        }
      }
      
      currentText += text[i];
      i++;
    }
    
    if (currentText) {
      parts.push(<span key={`text-final`}>{currentText}</span>);
    }
    
    return parts.length > 0 ? parts : text;
  };

  const parseFormattedText = (text) => {
    const paragraphs = text.split('\n\n');
    
    return (
      <div className="formatted-text">
        {paragraphs.map((paragraph, pIdx) => {
          if (paragraph.trim().startsWith('*') && paragraph.includes('\n*')) {
            const items = paragraph.split('\n').filter(line => line.trim().startsWith('*'));
            return (
              <ul key={pIdx} style={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
                {items.map((item, iIdx) => (
                  <li key={iIdx} style={{ marginBottom: '5px' }}>
                    {parseInlineMarkdown(item.replace(/^\*\s*/, ''))}
                  </li>
                ))}
              </ul>
            );
          }
          
          return <p key={pIdx} style={{ marginBottom: '10px' }}>{parseInlineMarkdown(paragraph)}</p>;
        })}
      </div>
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const data = await sendChatQuery(userMessage);

      let botText = data.respuesta_bot || "No he podido interpretar la respuesta.";
      
      if (!data.respuesta_bot) {
        if (data.type === "data") {
          const rowCount = Array.isArray(data.data) 
            ? data.data.length 
            : data.data?.rows?.length || 0;
          botText = `He encontrado ${rowCount} resultados.`;
        } else if (data.type === "chart") {
          botText = `He generado un gráfico de tipo ${data.chart_type}.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botText, payload: data },
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

    const handleDownloadPDF = async () => {
    if (!chatRef.current) return;

    const originalOverflow = chatRef.current.style.overflow;
    const originalHeight = chatRef.current.style.height;
    const originalMaxHeight = chatRef.current.style.maxHeight;

    chatRef.current.style.overflow = "visible";
    chatRef.current.style.height = "auto";
    chatRef.current.style.maxHeight = "none";

    const canvas = await html2canvas(chatRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      allowTaint: true,
      logging: false,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement("style");
        style.textContent = `
          * {
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          
          .chatArea {
            background-color: #ffffff !important;
          }
          
          .messagesWindow {
            background-color: #ffffff !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          
          .message-item {
            opacity: 1 !important;
          }
          
          .message-item.bot {
            background-color: #f5f5f5 !important;
          }
          
          .message-item.user {
            background-color: #a8c5f0 !important;
          }
          
          .message-item strong {
            opacity: 1 !important;
            color: #000000 !important;
            font-weight: 600 !important;
          }
          
          .message-item span,
          strong, span, p, div {
            color: #000000 !important;
            opacity: 1 !important;
          }
          
          .dataTable th,
          .dataTable td,
          .response-table th,
          .response-table td {
            background: #ffffff !important;
            border: 1px solid #333333 !important;
            color: #000000 !important;
            opacity: 1 !important;
          }
          
          .dataTable tr:nth-child(even) td,
          .response-table tr:nth-child(even) td {
            background-color: #f0f0f0 !important;
          }
          
          .chartContainer {
            background-color: #ffffff !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          
          canvas {
            opacity: 1 !important;
            filter: contrast(1.5) saturate(1.5) brightness(1.05) !important;
          }
          
         .downloadCSVButton {
          display: none !important;
        }
        `;
        clonedDoc.head.appendChild(style);

        clonedDoc.querySelectorAll("*").forEach((el) => {
          el.style.setProperty("opacity", "1", "important");
          el.style.setProperty("backdrop-filter", "none", "important");
          el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        });
      },
    });

    chatRef.current.style.overflow = originalOverflow;
    chatRef.current.style.height = originalHeight;
    chatRef.current.style.maxHeight = originalMaxHeight;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("chat.pdf");
  };

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      if (data.length === 0) return { columns: [], rows: [] };
      
      const columns = Object.keys(data[0]);
      const rows = data.map(obj => columns.map(col => obj[col]));
      
      return { columns, rows };
    } else if (data && data.columns && data.rows) {
      return data;
    }
    return { columns: [], rows: [] };
  };

  const handleDownloadCSV = (data, filename = "datos.csv") => {
    const normalized = normalizeData(data);
    const { columns, rows } = normalized;

    let csv = columns.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleDownloadChartCSV = (payload) => {
    const data = payload.data;
    handleDownloadCSV(data, `grafico_${payload.chart_type}.csv`);
  };

  if (isAuthorized === null) return <p>Verificando permisos...</p>;

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
    <section className="chat">
      <article className="chatHeader">
      <h1>Tu chatbot</h1>
      <p>Realiza todas tus consultas. Si no sabes como empezar, no dudes en revisar nuestra guía.</p>
      </article>
      <article className="actionButtons">
        <button className="backButton" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Volver
        </button>
        <button className="guideButton" onClick={() => navigate("/guia")}>
          <Info size={28} />
          Guía de uso
        </button>
      </article>
      <article className="chatArea">
        <aside className="messagesWindow" ref={chatRef}>
          {messages.map((msg, index) => {
            const normalizedData = msg.payload?.data 
              ? normalizeData(msg.payload.data) 
              : null;

            return (
              <div key={index} className={`message-item ${msg.sender}`}>
                <strong>{msg.sender === "user" ? "Tú:" : "Bot:"}</strong>
                <div className="message-content">
                  {msg.sender === "bot" ? formatBotResponse(msg.text) : <span>{msg.text}</span>}
                </div>

                {msg.sender === "bot" && msg.payload?.type === "chart" && (
                  <div className="chartContainer">
                    <ChartRenderer payload={msg.payload} />
                    <button
                      className="downloadCSVButton"
                      onClick={() => handleDownloadChartCSV(msg.payload)}
                    >
                      <BarChart2 size={16} /> Descargar datos CSV
                    </button>
                  </div>
                )}

                {msg.sender === "bot" && msg.payload?.type === "data" && normalizedData && (
                  <>
                    <table className="dataTable">
                      <thead>
                        <tr>
                          {normalizedData.columns.map((col, idx) => {
                            const nombresHumanos = {
                              date_trunc: "Fecha",
                              max_importe_total: "Importe total máximo",
                              total_importe_total: "Importe total",
                              promedio_importe_total: "Promedio importe total",
                              total_cantidad: "Cantidad total",
                              pais: "País",
                              conteo_transacciones: "Conteo de transacciones",
                              producto: "Producto",
                              ventas: "Ventas",
                              coste: "Coste",
                              margen: "Margen",
                            };
                            return (
                              <th key={idx}>{nombresHumanos[col] || col}</th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {normalizedData.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => {
                              const colName = normalizedData.columns[cIdx];

                              if (colName === "date_trunc") {
                                const fecha = new Date(cell);
                                return (
                                  <td key={cIdx}>{fecha.toLocaleDateString()}</td>
                                );
                              }
                              
                              if (typeof cell === "number" && 
                                  (colName === "ventas" || colName === "coste" || 
                                   colName === "margen" || colName.includes("importe"))) {
                                return (
                                  <td key={cIdx}>{cell.toLocaleString("es-ES", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}</td>
                                );
                              }
                              
                              return <td key={cIdx}>{cell}</td>;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="downloadCSVButton"
                      onClick={() =>
                        handleDownloadCSV(msg.payload.data, "tabla_datos.csv")
                      }
                    >
                      <FileText size={16} /> Descargar tabla CSV
                    </button>
                  </>
                )}
              </div>
            );
          })}
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
          <div className="chatButtons">
            <button className="sendButton" type="submit" disabled={loading}>
              {loading ? (
                "..."
              ) : (
                <>
                  <Send size={16} /> Enviar
                </>
              )}
            </button>
            <button className="downloadPDFButton" onClick={handleDownloadPDF}>
              <Download size={16} /> Descargar chat en PDF
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};

export default Chat;