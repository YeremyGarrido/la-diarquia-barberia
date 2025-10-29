/**
 * @file bookings.controller.js
 * @description Controlador para gestionar las reservas de citas
 */

const bookingService = require('../services/booking.service');
const { validateBookingData } = require('../services/validation.service');

const createBooking = async (req, res) => {
    try {
        const bookingData = req.body;
        console.log('📅 Procesando nueva reserva:', bookingData);

        validateBookingData(bookingData);
        const result = await bookingService.processNewBooking(bookingData);

        res.status(201).json({
            success: true,
            message: 'Reserva creada exitosamente',
            data: result
        });

    } catch (error) {
        console.error('❌ Error al crear reserva:', error);

        if (error.statusCode === 400) {
            return res.status(400).json({
                success: false,
                message: error.message,
                details: error.details || undefined
            });
        }

        if (error.message.includes('Google Calendar')) {
            return res.status(503).json({
                success: false,
                message: 'Error al conectar con Google Calendar. Intenta más tarde.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = { createBooking };
