/**
 * @file validation.service.js
 * @description Servicio para la validación de datos de entrada.
 * @author La Diarquía Backend Team
 */

/**
 * Valida los datos de una nueva reserva.
 * Si la validación falla, arroja un error con detalles.
 * @param {object} data - Los datos de la reserva a validar.
 */
const validateBookingData = (data) => {
  const { name, email, phone, service, date, time } = data;

  // 1. Validación de campos obligatorios
  const missingFields = {
    name: !name,
    email: !email,
    phone: !phone,
    service: !service,
    date: !date,
    time: !time,
  };

  if (Object.values(missingFields).some((isMissing) => isMissing)) {
    const error = new Error("Todos los campos son obligatorios");
    error.statusCode = 400;
    error.details = { missingFields };
    throw error;
  }

  // 2. Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("El formato del email no es válido");
    error.statusCode = 400;
    throw error;
  }

  // 3. Validación de formato de teléfono chileno
  const phoneRegex = /^\+?56\s?9\d{8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    const error = new Error("El formato del teléfono debe ser +56 9XXXXXXXX");
    error.statusCode = 400;
    throw error;
  }

  // Si todo es válido, no retorna nada.
};

module.exports = {
  validateBookingData,
};
