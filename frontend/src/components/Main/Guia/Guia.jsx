import React from "react";

const Guia = () => {
return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h1>Guía de Usuario para el Chatbot de Consultas SQL</h1>

      <h2>¿Qué es este chatbot?</h2>
      <p>
        Este chatbot permite que cualquier usuario realice preguntas sobre los
        datos de e-commerce en lenguaje natural (español o inglés) y obtenga
        respuestas automáticas gracias a la traducción de texto a SQL.
      </p>

      <h2>¿Cómo funciona?</h2>
      <p>Escribe tu pregunta en el chat, por ejemplo:</p>
      <ul>
        <li>¿Cuántas ventas hubo en 2024?</li>
        <li>Top 5 productos más vendidos en 2023</li>
        <li>Promedio de ventas por país en 2024</li>
      </ul>

      <p>
        El chatbot interpreta tu pregunta y la traduce a una consulta SQL.
        Recibes la respuesta directamente en el chat, sin necesidad de saber SQL.
      </p>

      <h2>Ejemplos de preguntas</h2>
      <ul>
        <li>¿Cuántas transacciones hubo en 2024?</li>
        <li>Ventas totales el 2024 por país</li>
        <li>Top 5 productos más vendidos en 2024</li>
        <li>Número de clientes menores de 30 en México en 2024</li>
      </ul>

      <h2>¿Qué tipo de información puedes consultar?</h2>
      <ul>
        <li><b>Métricas:</b> ventas, ingresos, cantidad, precio</li>
        <li><b>Filtros:</b> año, mes, país, producto, edad</li>
        <li><b>Agrupaciones:</b> año, mes, país</li>
        <li><b>Rankings:</b> top productos, mayores ventas</li>
      </ul>

      <h2>Consejos</h2>
      <ul>
        <li>Usa frases claras y directas</li>
        <li>Puedes preguntar en español o inglés</li>
        <li>Reformula la pregunta si no entiendes la respuesta</li>
      </ul>

      <h2>¿Listo para empezar?</h2>
      <p>
        ¡Ya puedes comenzar a explorar tus datos de e-commerce de forma sencilla
        y natural!
      </p>
    </div>
  );
};


export default Guia;
