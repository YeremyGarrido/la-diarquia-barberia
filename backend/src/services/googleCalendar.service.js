/**
 * @file googleCalendar.service.js
 * @description Servicio para integración con Google Calendar API
 * @author La Diarquía Backend Team
 */

const { google } = require("googleapis");

// Validación de variables mínimas requeridas para Google Calendar
const assertGoogleEnv = () => {
  const required = [
    "GOOGLE_CLIENT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
    "GOOGLE_CALENDAR_ID",
  ];
  const missing = required.filter(
    (k) => !process.env[k] || !String(process.env[k]).trim()
  );
  if (missing.length) {
    throw new Error(
      `Google Calendar: faltan variables de entorno: ${missing.join(", ")}`
    );
  }
};

/**
 * Configuración del cliente de Google Calendar usando Service Account
 */
const getCalendarClient = () => {
  try {
    // Verifica variables de entorno mínimas
    assertGoogleEnv();
    // Autenticación con Service Account usando variables de entorno
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Convertir \n literal a saltos de línea
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    return google.calendar({ version: "v3", auth });
  } catch (error) {
    // Log enriquecido para facilitar depuración externa (Google APIs)
    try {
      const payload =
        (error && error.response && error.response.data) ||
        error.errors ||
        error.message;
      console.error("Google Calendar: error al crear evento:", payload);
    } catch (e) {
      console.error(
        "Google Calendar: error al crear evento (no parseable):",
        error
      );
    }
    console.error("Error al configurar cliente de Google Calendar:", error);
    throw new Error("Google Calendar: Error de configuración");
  }
};

/**
 * Crea un evento en Google Calendar
 * @param {Object} bookingData - Datos de la reserva
 * @param {string} bookingData.name - Nombre del cliente
 * @param {string} bookingData.email - Email del cliente
 * @param {string} bookingData.phone - Teléfono del cliente
 * @param {string} bookingData.service - Servicio solicitado
 * @param {string} bookingData.date - Fecha de la cita (YYYY-MM-DD)
 * @param {string} bookingData.time - Hora de la cita (HH:MM)
 * @returns {Object} Evento creado
 */
const createEvent = async (bookingData) => {
  try {
    const { name, email, phone, service, date, time } = bookingData;

    // Construir la fecha y hora del evento
    const startDateTimeStr = `${date}T${time}:00`;

    // Calcular hora de finalización (por defecto 1 hora después)
    const [h, m] = (time || "").split(":").map(Number);
    const endHour = isNaN(h) ? 0 : h + 1;
    const endDateTimeStr = `${date}T${String(endHour).padStart(2, "0")}:${
      isNaN(m) ? "00" : String(m).padStart(2, "0")
    }:00`;

    // Mapear nombres de servicios a descripciones más detalladas
    const serviceDescriptions = {
      "corte-personalizado": "Corte de Cabello Personalizado",
      "corte-barba-diarquia":
        'Corte y Barba "La Diarquía" - Experiencia Premium',
      "barba-personalizada": "Barba Personalizada con Toallas Calientes",
      "limpieza-facial": "Limpieza Facial FULL",
      "corte-tijeras": "Corte sólo a Tijeras",
      "camuflaje-canas": "Camuflaje de Canas",
    };

    const serviceDescription = serviceDescriptions[service] || service;

    // Configurar el evento
    const event = {
      summary: `${serviceDescription} - ${name}`,
      description: `
**RESERVA - LA DIARQUÍA BARBERÍA**

Cliente: ${name}
Email: ${email}
Teléfono: ${phone}
Servicio: ${serviceDescription}

---
Reserva realizada a través del sistema web de La Diarquía.
            `.trim(),
      location: "Almte. Pastene 70, Providencia, Santiago, Chile",
      start: {
        dateTime: startDateTimeStr,
        timeZone: "America/Santiago",
      },
      end: {
        dateTime: endDateTimeStr,
        timeZone: "America/Santiago",
      },
      // La propiedad 'attendees' requiere permisos especiales (delegación de dominio)
      // para que una Service Account pueda añadir invitados. Se comenta para evitar errores 403.
      // attendees: [
      //     { email: email }
      // ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 día antes
          { method: "popup", minutes: 60 }, // 1 hora antes
        ],
      },
      colorId: "9", // Color azul para reservas de barbería
    };

    // Obtener cliente de Google Calendar
    const calendar = getCalendarClient();

    // Insertar el evento en el calendario
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      resource: event,
      // 'sendUpdates' notifica a los 'attendees'. Al no tenerlos, se puede omitir.
      // sendUpdates: 'all'
    });

    console.log("Evento creado en Google Calendar:", response.data.id);

    return {
      id: response.data.id,
      htmlLink: response.data.htmlLink,
      status: response.data.status,
      created: response.data.created,
    };
  } catch (error) {
    console.error("Error al crear evento en Google Calendar:", error);

    // Manejo de errores específicos
    if (error.code === 401) {
      throw new Error("Google Calendar: Credenciales inválidas o expiradas");
    }
    if (error.code === 403) {
      throw new Error("Google Calendar: Permisos insuficientes");
    }
    if (error.code === 404) {
      throw new Error("Google Calendar: Calendar ID no encontrado");
    }

    throw new Error(`Google Calendar: ${error.message}`);
  }
};

/**
 * Obtiene eventos de un rango de fechas (útil para verificar disponibilidad)
 * @param {string} startDate - Fecha de inicio (YYYY-MM-DD)
 * @param {string} endDate - Fecha de fin (YYYY-MM-DD)
 * @returns {Array} Lista de eventos
 */
const getEvents = async (startDate, endDate) => {
  try {
    const calendar = getCalendarClient();

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      timeMin: new Date(`${startDate}T00:00:00`).toISOString(),
      timeMax: new Date(`${endDate}T23:59:59`).toISOString(),
      timeZone: "America/Santiago",
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error al obtener eventos de Google Calendar:", error);
    throw new Error(`Google Calendar: ${error.message}`);
  }
};

module.exports = {
  createEvent,
  getEvents,
};
