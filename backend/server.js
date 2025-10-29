/**
 * @file server.js
 * @description Servidor principal de la aplicación - La Diarquía Barbería
 * @author La Diarquía Backend Team
 */

// Cargar variables de entorno
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// ==============================================
// MIDDLEWARE DE SEGURIDAD Y CONFIGURACIÓN
// ==============================================

// Configuración de CORS
const corsOptions = {
  origin: [
    "http://localhost:8080", // Frontend local
    "http://localhost:3000", // Pruebas locales
    "https://clone-barber.vercel.app", // Frontend en Vercel (actualizar con tu dominio)
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ==============================================
// MIDDLEWARE DE APLICACIÓN
// ==============================================

// Parser de JSON
app.use(express.json());

// Parser de URL-encoded (para formularios)
app.use(express.urlencoded({ extended: true }));

// ==============================================
// RUTAS
// ==============================================

// Importar rutas de reservas
const bookingRoutes = require("./src/routes/bookings.routes");

// Ruta de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "La Diarquía - API de Reservas",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      bookings: "POST /api/bookings",
    },
  });
});

// Montar las rutas de la API de reservas
app.use("/api/bookings", bookingRoutes);

// Ruta 404 - No encontrado
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// ==============================================
// MANEJO DE ERRORES GLOBAL
// ==============================================

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ==============================================
// INICIAR SERVIDOR
// ==============================================

app.listen(port, () => {
  console.log("\n" + "=".repeat(60));
  console.log(" LA DIARQUÍA - SERVIDOR BACKEND  ");
  console.log("=".repeat(60));
  console.log(`Servidor ejecutándose en: http://localhost:${port}`);
  console.log(`Fecha de inicio: ${new Date().toLocaleString("es-CL")}`);
  console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`CORS habilitado para:`, corsOptions.origin);
  console.log(`Endpoints disponibles:`);
  console.log(`   - GET  /`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/bookings`);
  console.log("=".repeat(60) + "\n");
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido. Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT recibido. Cerrando servidor...");
  process.exit(0);
});

module.exports = app;
