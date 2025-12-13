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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // IMPORTANTE: Esta ruta debe ir al final y capturar TODAS las rutas
  // que no sean de API, para que React Router las maneje
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "public")));
}

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
