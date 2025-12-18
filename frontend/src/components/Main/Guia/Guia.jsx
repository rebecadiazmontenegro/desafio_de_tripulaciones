import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Activity,
  Layers,
  Zap,
  XCircle,
  AlertCircle,
  Rocket,
  Bell,
  ArrowLeft,
} from "lucide-react";

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
            <h2>
              <Info size={32} style={{ marginRight: "10px" }} />
              ¿Qué es este chatbot?
            </h2>
            <p>
             Este chatbot permite a cualquier usuario realizar preguntas sobre los datos de e-commerce en lenguaje natural y obtener visualizaciones, datos y un análisis.
            </p>
          </div>

          <div>
            <h2>
              <Activity size={32} style={{ marginRight: "10px" }} />
              ¿Cómo funciona?
            </h2>
            <ol>
              <li>
                <b>Escribe tu pregunta</b> en el chat, por ejemplo:
                <ul>
                  <li>¿Cuántas ventas hubo en 2024?</li>
                  <li>Top 10 productos más vendidos en 2023 por categoria</li>
                  <li>Promedio de ventas por país en 2024</li>
                   <li>Genera un gráfico con la cuota de medios de pago</li>
                  <li>Muestra los 50 clientes con mayor AOV junto a sus datos demográficos</li>
                  <li>Calcula el beneficio total por país y genera un grafico de barras</li>
                </ul>
              </li>
              <li>
                <b>El chatbot interpreta tu pregunta</b> y la traduce a una
                consulta SQL.
              </li>
              <li>
                <b>Recibes la respuesta</b> directamente en el chat, sin
                necesidad de saber SQL ni manejar bases de datos.
              </li>
            </ol>
          </div>
        </aside>

        <aside className="asideTwo">
          <h2>
            <Layers size={32} style={{ marginRight: "10px" }} />
            Ejemplos de preguntas que puedes hacer
          </h2>
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
          <h2>
            <Zap size={32} style={{ marginRight: "10px" }} />
            ¿Qué tipo de información puedes consultar?
          </h2>
          <ul>
            <li>
              <b>Métricas:</b> ventas, ingresos, cantidad, precio, etc.
            </li>
            <li>
              <b>Filtros:</b> por año, mes, trimestre, país, ciudad, producto,
              categoría, género, edad.
            </li>
            <li>
              <b>Agrupaciones:</b> por año, mes, trimestre, país, etc.
            </li>
            <li>
              <b>Rankings:</b> top productos, mayores ventas, etc.
            </li>
            <li>
              <b>Gráficos:</b> de barras, de línea o de quesito sobre ventas,
              productos, etc. por meses, años, cantidades o frecuencias. Eso sí,
              debes indicar qué tipo de gráfico quieres específicamente.
            </li>
          </ul>
        </aside>

        <aside className="asideFour">
          <h2>
            <XCircle size={32} style={{ marginRight: "10px" }} />
            Consejos para mejores resultados
          </h2>
          <ul>
            <li>Usa frases claras y directas.</li>
            <li>Puedes preguntar en cualquier idioma.</li>
            <li>
              No te olvides de indicar tu gráfico favorito: de líneas, barras o
              incluso de quesito.
            </li>
          </ul>
        </aside>

        <aside className="asideFive">
          <h2>
            <AlertCircle size={32} style={{ marginRight: "10px" }} />
            ¿Qué NO necesitas saber?
          </h2>
          <ul>
            <li>No necesitas saber SQL.</li>
            <li>No necesitas saber cómo funciona la base de datos.</li>
            <li>No necesitas instalar nada: solo usa el chat.</li>
          </ul>
        </aside>

        <aside className="asideSix">
          <h2>
            <Bell size={32} style={{ marginRight: "10px" }} />
            ¿Qué hacer si tienes problemas?
          </h2>
          <ul>
            <li>
              Si el chatbot no entiende tu pregunta, intenta con otra redacción o
              consulta los ejemplos.
            </li>
            <li>
              Si recibes un mensaje de error, contacta con el soporte técnico.
            </li>
          </ul>
        </aside>

        <aside className="asideSeven">
          <h2>
            <Rocket size={32} style={{ marginRight: "10px" }} />
            ¿Listo para empezar?
          </h2>
          <p>
            ¡Ya puedes comenzar a explorar tus datos de e-commerce de forma
            sencilla y natural! No importa si nunca has usado una base de datos:
            este chatbot está diseñado para ayudarte a obtener la información
            que necesitas con solo escribir tu pregunta.
          </p>
        </aside>

        <aside className="asideEight">
          <h2>
            <Info size={32} style={{ marginRight: "10px" }} />
            Recuerda:
          </h2>
          <ul>
            <li>No tengas miedo de experimentar con diferentes preguntas.</li>
            <li>Si tienes dudas, revisa los ejemplos o consulta con tu equipo.</li>
            <li>
              El chatbot está en constante mejora: tus sugerencias y comentarios
              son bienvenidos.
            </li>
          </ul>
          <p>
            ¿Tienes alguna pregunta, sugerencia o necesitas soporte? Contáctanos
            a través de GitHub o LinkedIn.
          </p>
          <p>
            <b>¡Saca el máximo partido a tus datos con Kairo!</b>
          </p>
        </aside>
      </article>
    </section>
  );
};

export default Guia;
