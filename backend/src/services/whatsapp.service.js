/**
 * @file whatsapp.service.js
 * @description Servicio para integración con WhatsApp Business API (Meta)
 * @author La Diarquía Backend Team
 */

const axios = require("axios");

/**
 * Envía un mensaje de confirmación de reserva por WhatsApp usando plantilla pre-aprobada
 * La plantilla utilizada es: "confirmacion_reserva_barberia"
 * @param {Object} bookingData - Datos de la reserva
 * @param {string} bookingData.name - Nombre del cliente (Variable {{1}} de la plantilla)
 * @param {string} bookingData.phone - Teléfono del cliente
 * @param {string} bookingData.service - Servicio solicitado (Variable {{2}} de la plantilla)
 * @param {string} bookingData.date - Fecha de la cita en formato YYYY-MM-DD (se convierte a {{3}})
 * @param {string} bookingData.time - Hora de la cita en formato HH:MM (Variable {{4}} de la plantilla)
 * @returns {Object} Respuesta de la API de WhatsApp con el messageId
 */
const sendConfirmation = async (bookingData) => {
  try {
    const { name, phone, service, date, time } = bookingData;
    // Validación de entorno
    if (
      !process.env.WHATSAPP_PHONE_NUMBER_ID ||
      !process.env.WHATSAPP_ACCESS_TOKEN
    ) {
      throw new Error(
        "WhatsApp: faltan variables de entorno WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_ACCESS_TOKEN"
      );
    }

    // Formatear el número de teléfono (remover espacios, guiones y el símbolo +)
    const formattedPhone = phone.replace(/[\s\-+]/g, "");

    // Mapear servicios a nombres amigables
    const serviceNames = {
      "corte-personalizado": "Corte de Cabello Personalizado",
      "corte-barba-diarquia": 'Corte y Barba "La Diarquía"',
      "barba-personalizada": "Barba Personalizada",
      "limpieza-facial": "Limpieza Facial FULL",
      "corte-tijeras": "Corte sólo a Tijeras",
      "camuflaje-canas": "Camuflaje de Canas",
    };

    const serviceName = serviceNames[service] || service;

    // Formatear la fecha a formato legible (DD/MM/YYYY)
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    // URL de la API de WhatsApp Business (Graph API de Meta)
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    // Configurar la petición usando plantilla pre-aprobada
    const requestData = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "template",
      template: {
        name: "confirmacion_reserva_barberia", // Nombre exacto de la plantilla en Meta
        language: {
          code: "es",
        },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name }, // Variable {{1}} - Nombre del cliente
              { type: "text", text: serviceName }, // Variable {{2}} - Nombre del servicio
              { type: "text", text: formattedDate }, // Variable {{3}} - Fecha formateada
              { type: "text", text: time }, // Variable {{4}} - Hora de la cita
            ],
          },
        ],
      },
    };

    // Realizar la petición POST a la API de Meta
    const response = await axios.post(url, requestData, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      'Mensaje de WhatsApp enviado exitosamente usando plantilla "confirmacion_reserva_barberia":',
      response.data
    );

    return {
      messageId: response.data.messages[0].id,
      status: "sent",
      recipient: formattedPhone,
    };
  } catch (error) {
    console.error("Error al enviar mensaje de WhatsApp:", error);

    // Manejo de errores específicos de la API de Meta
    if (error.response) {
      const { status, data } = error.response;
      // Log del cuerpo del error de Meta para depuración
      try {
        console.error(
          "WhatsApp API error response:",
          JSON.stringify(data, null, 2)
        );
      } catch (_) {
        console.error("WhatsApp API error response (raw):", data);
      }

      if (status === 401) {
        throw new Error("WhatsApp: Token de acceso inválido o expirado");
      }
      if (status === 403) {
        throw new Error("WhatsApp: Permisos insuficientes");
      }
      if (status === 404) {
        throw new Error("WhatsApp: Phone Number ID no encontrado");
      }
      if (status === 400) {
        throw new Error(
          `WhatsApp: ${data.error?.message || "Solicitud inválida"}`
        );
      }

      throw new Error(
        `WhatsApp: Error ${status} - ${
          data.error?.message || "Error desconocido"
        }`
      );
    }

    // Error de conexión
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      throw new Error("WhatsApp: No se pudo conectar con la API de Meta");
    }

    throw new Error(`WhatsApp: ${error.message}`);
  }
};

/**
 * Envía un mensaje personalizado por WhatsApp (útil para recordatorios o cancelaciones)
 * @param {string} phone - Número de teléfono del destinatario
 * @param {string} message - Mensaje a enviar
 * @returns {Object} Respuesta de la API
 */
const sendMessage = async (phone, message) => {
  try {
    if (
      !process.env.WHATSAPP_PHONE_NUMBER_ID ||
      !process.env.WHATSAPP_ACCESS_TOKEN
    ) {
      throw new Error(
        "WhatsApp: faltan variables de entorno WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_ACCESS_TOKEN"
      );
    }
    const formattedPhone = phone.replace(/[\s\-+]/g, "");

    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const requestData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    };

    const response = await axios.post(url, requestData, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return {
      messageId: response.data.messages[0].id,
      status: "sent",
      recipient: formattedPhone,
    };
  } catch (error) {
    console.error("Error al enviar mensaje personalizado:", error);
    throw new Error(`WhatsApp: ${error.message}`);
  }
};

module.exports = {
  sendConfirmation,
  sendMessage,
};
