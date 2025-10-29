/**
 * @file booking.service.js
 * @description Servicio para la lógica de negocio de las reservas.
 */

const googleCalendarService = require("./googleCalendar.service");
const whatsappService = require("./whatsapp.service");

/**
 * Procesa la creación de una nueva reserva.
 * Orquesta la creación del evento en Google Calendar y el envío de la confirmación por WhatsApp.
 * @param {object} bookingData - Datos de la reserva ya validados.
 * @returns {Promise<object>} Un objeto con los resultados de la operación.
 */
const processNewBooking = async (bookingData) => {
  console.log("Creando evento en Google Calendar...");
  const calendarEvent = await googleCalendarService.createEvent(bookingData);
  console.log("Evento creado en Google Calendar:", calendarEvent.id);

  console.log("Enviando confirmación por WhatsApp...");
  const whatsappResponse = await whatsappService.sendConfirmation(bookingData);
  console.log("Mensaje de WhatsApp enviado:", whatsappResponse.messageId);

  return {
    bookingId: calendarEvent.id,
    calendarEventId: calendarEvent.id,
    calendarEventLink: calendarEvent.htmlLink,
    whatsappMessageId: whatsappResponse.messageId,
    customer: {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
    },
    appointment: {
      service: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
    },
  };
};

module.exports = {
  processNewBooking,
};
