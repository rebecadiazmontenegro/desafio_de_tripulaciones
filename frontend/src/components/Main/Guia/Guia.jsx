import React from "react";
import { useNavigate } from "react-router-dom";
import { Info, Activity, Layers, Zap, XCircle, AlertCircle, Rocket, Bell, ArrowLeft } from "lucide-react";

const Guia = () => {
  const navigate = useNavigate();
  return (
    <section className="guiaInfo">
      <h1>Guía de Usuario para el Chatbot de Consultas SQL</h1>
       <button className="backButton" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Volver
      </button>
      <article className="guia" style={{ padding: "20px", maxWidth: "800px" }}>
        <aside className="asideOne">
          <div>
            <h2><Info size={32} style={{ marginRight: "10px" }} />¿Qué es este chatbot?</h2>
            <p>
              Este chatbot permite que cualquier usuario realice preguntas sobre
              los datos de e-commerce en lenguaje natural (español o inglés) y
              obtenga respuestas automáticas gracias a la traducción de texto a
              SQL.
            </p>
          </div>
          <div>
            <h2><Activity size={32} style={{ marginRight: "10px" }} />¿Cómo funciona?</h2>
            <p>Escribe tu pregunta en el chat, por ejemplo:</p>
            <ul>
              <li>¿Cuántas ventas hubo en 2024?</li>
              <li>Top 5 productos más vendidos en 2023</li>
              <li>Promedio de ventas por país en 2024</li>
            </ul>
            <p>
              El chatbot interpreta tu pregunta y la traduce a una consulta SQL.
              Recibes la respuesta directamente en el chat, sin necesidad de
              saber SQL ni manejar bases de datos.
            </p>
          </div>
        </aside>

        <aside className="asideTwo">
          <h2><Layers size={32} style={{ marginRight: "10px" }} />Ejemplos de preguntas que puedes hacer</h2>
          <ul>
            <li>¿Cuántas transacciones hubo en 2024?</li>
            <li>Ventas totales el 2024 por país</li>
            <li>Muéstrame el promedio de ventas en 2023 por trimestre</li>
            <li>Top 5 productos más vendidos en 2024</li>
            <li>Número de clientes menores de 30 en México en 2024</li>
            <li>Mediana de importe_total por mes en 2023</li>
            <li>Ventas máximas por país en enero</li>
          </ul>
        </aside>

        <aside className="asideThree">
          <h2><Zap size={32} style={{ marginRight: "10px" }} />¿Qué tipo de información puedes consultar?</h2>
          <ul>
            <li><b>Métricas:</b> ventas, ingresos, cantidad, precio, etc.</li>
            <li><b>Filtros:</b> por año, mes, trimestre, país, ciudad, producto, categoría, género, edad.</li>
            <li><b>Agrupaciones:</b> por año, mes, trimestre, país, etc.</li>
            <li><b>Rankings:</b> top productos, mayores ventas, etc.</li>
            <li><b>Gráficos:</b> de barras, de línea o de quesito sobre ventas, productos, etc.</li>
          </ul>
        </aside>

        <aside className="asideFour">
          <h2><XCircle size={32} style={{ marginRight: "10px" }} />Consejos para mejores resultados</h2>
          <ul>
            <li>Usa frases claras y directas.</li>
            <li>Puedes preguntar en español o inglés.</li>
            <li>Si no entiendes una respuesta, prueba a reformular la pregunta.</li>
            <li>No olvides indicar tu gráfico favorito: de líneas, barras o quesito.</li>
          </ul>
        </aside>

        <aside className="asideFive">
          <h2><AlertCircle size={32} style={{ marginRight: "10px" }} />¿Qué NO necesitas saber?</h2>
          <ul>
            <li>No necesitas saber SQL.</li>
            <li>No necesitas saber cómo funciona la base de datos.</li>
            <li>No necesitas instalar nada: solo usa el chat.</li>
          </ul>
        </aside>

        <aside className="asideSix">
          <h2><Bell size={32} style={{ marginRight: "10px" }} />¿Qué hacer si tienes problemas?</h2>
          <ul>
            <li>Si el chatbot no entiende tu pregunta, intenta con otra redacción o consulta los ejemplos.</li>
            <li>Si recibes un mensaje de error, contacta con el soporte técnico.</li>
          </ul>
        </aside>

        <aside className="asideSeven">
          <h2><Rocket size={32} style={{ marginRight: "10px" }} />¿Listo para empezar?</h2>
          <p>¡Ya puedes comenzar a explorar tus datos de e-commerce de forma sencilla y natural! Este chatbot está diseñado para ayudarte a obtener la información que necesitas con solo escribir tu pregunta.</p>
        </aside>

        <aside className="asideEight">
          <h2><Info size={32} style={{ marginRight: "10px" }} />Recuerda:</h2>
          <ul>
            <li>No tengas miedo de experimentar con diferentes preguntas.</li>
            <li>Si tienes dudas, revisa los ejemplos o consulta con tu equipo.</li>
            <li>El chatbot está en constante mejora: tus sugerencias y comentarios son bienvenidos.</li>
          </ul>
          <p>¿Tienes alguna pregunta, sugerencia o necesitas soporte? Contáctanos a través de GitHub o LinkedIn. ¡Saca el máximo partido a tus datos con Kairo!</p>
        </aside>
      </article>
    </section>
  );
};

export default Guia;
