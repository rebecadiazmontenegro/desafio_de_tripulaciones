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

// Las rutas de API deben ir ANTES del static y el catch-all
const usersRoutes = require("./routes/user.routes");
app.use("/user", usersRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // Este catch-all debe ir AL FINAL para que todas las rutas no-API devuelvan index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // En desarrollo no sirves archivos estáticos desde Express
  app.use(express.static(path.join(__dirname, "public")));
}

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});