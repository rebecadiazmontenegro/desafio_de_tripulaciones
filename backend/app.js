const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use('/api-jsdoc', express.static(path.join(__dirname, '/jsondocs')));
app.use(express.static(path.join(__dirname, "public")));

const usersRoutes = require("./routes/user.routes");
app.use("/user", usersRoutes);

// if (process.env.NODE_ENV==="production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
//   });
// }

// Configuración según el entorno
if (process.env.NODE_ENV === "production") {
  // Servir archivos estáticos del frontend compilado
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // Catch-all: redirigir todas las rutas restantes a index.html
  // Esto permite que React Router maneje el enrutamiento del cliente
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // En desarrollo, servir archivos estáticos locales
  app.use(express.static(path.join(__dirname, "public")));
}

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
