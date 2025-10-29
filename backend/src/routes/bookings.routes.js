/**
 * @file bookings.routes.js
 * @description Define las rutas para el endpoint de reservas
 * @author La Diarquía Backend Team
 */

const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');

/**
 * POST /api/bookings
 * Crea una nueva reserva, la registra en Google Calendar y envía confirmación por WhatsApp
 */
router.post('/', bookingsController.createBooking);

/**
 * GET /api/bookings (opcional - para futuras expansiones)
 * Obtiene todas las reservas
 */
// router.get('/', bookingsController.getAllBookings);

/**
 * GET /api/bookings/:id (opcional - para futuras expansiones)
 * Obtiene una reserva específica por ID
 */
// router.get('/:id', bookingsController.getBookingById);

module.exports = router;
