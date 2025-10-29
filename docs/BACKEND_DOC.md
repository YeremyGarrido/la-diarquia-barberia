# BACKEND DOCUMENTATION - La Diarquía Barbería

## Estructura del Servidor Node.js

```
backend/
├── server.js                         # Entrada principal
├── package.json                      # Dependencias NPM
├── .env / .env.example              # Variables de entorno
└── src/
    ├── controllers/
    │   └── bookings.controller.js   # Controladores HTTP
    ├── routes/
    │   └── bookings.routes.js       # Definición de rutas
    └── services/
        ├── booking.service.js        # Lógica de negocio
        ├── googleCalendar.service.js # Integración Google
        ├── whatsapp.service.js       # Integración WhatsApp
        └── validation.service.js     # Validaciones

Total: 8 archivos principales + node_modules
```

## Rutas del Backend

### Endpoints Disponibles

| Método | Ruta            | Descripción    | Body         | Response              |
| ------ | --------------- | -------------- | ------------ | --------------------- |
| `GET`  | `/`             | Info de la API | -            | JSON con info general |
| `GET`  | `/health`       | Health check   | -            | Status 200 OK         |
| `POST` | `/api/bookings` | Crear reserva  | Booking data | Booking confirmado    |

## Controladores (Controllers)

### bookings.controller.js

```javascript
const createBooking = async (req, res) => {
  try {
    // 1. Extraer datos del body
    const bookingData = req.body;

    // 2. Validar datos
    validateBookingData(bookingData);

    // 3. Procesar reserva (Google Calendar + WhatsApp)
    const result = await bookingService.processNewBooking(bookingData);

    // 4. Responder exitosamente
    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: result,
    });
  } catch (error) {
    // Manejo de errores con códigos HTTP apropiados
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
```

**Función**: `createBooking(req, res)`

- **Entrada**: `req.body` con datos de la reserva
- **Salida**: JSON con confirmación o error
- **Side-effects**: Crea evento en Calendar + envía WhatsApp

## Servicios (Services)

### 1. booking.service.js

**Orquestador principal de reservas**

```javascript
const processNewBooking = async (bookingData) => {
  // 1. Crear evento en Google Calendar
  const calendarEvent = await googleCalendarService.createEvent(bookingData);

  // 2. Enviar confirmación por WhatsApp
  const whatsappResponse = await whatsappService.sendConfirmation(bookingData);

  // 3. Retornar resumen completo
  return {
    bookingId: calendarEvent.id,
    calendarEventId: calendarEvent.id,
    calendarEventLink: calendarEvent.htmlLink,
    whatsappMessageId: whatsappResponse.messageId,
    customer: { name, email, phone },
    appointment: { service, date, time },
  };
};
```

### 2. googleCalendar.service.js

**Integración con Google Calendar API v3**

**Funciones principales**:

- `getCalendarClient()`: Autenticación con Service Account
- `createEvent(bookingData)`: Crea evento en el calendario
- `getEvents(startDate, endDate)`: Lista eventos (futuro uso)

**Flujo de autenticación**:

```javascript
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });
```

**Estructura del evento**:

```javascript
{
  summary: `${serviceName} - ${name}`,
  description: "Detalles de la reserva...",
  location: "Almte. Pastene 70, Providencia, Santiago, Chile",
  start: { dateTime: "2024-10-29T15:00:00", timeZone: "America/Santiago" },
  end: { dateTime: "2024-10-29T16:00:00", timeZone: "America/Santiago" },
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 24 * 60 },  // 1 día antes
      { method: 'popup', minutes: 60 }        // 1 hora antes
    ]
  },
  colorId: '9'  // Color azul
}
```

### 3. whatsapp.service.js

**Integración con WhatsApp Business API (Meta)**

**Funciones principales**:

- `sendConfirmation(bookingData)`: Envía plantilla pre-aprobada
- `sendMessage(phone, message)`: Mensaje personalizado

**Plantilla de WhatsApp**: `confirmacion_reserva_barberia`

**Variables de la plantilla**:

1. `{{1}}` - Nombre del cliente
2. `{{2}}` - Nombre del servicio
3. `{{3}}` - Fecha formateada (DD/MM/YYYY)
4. `{{4}}` - Hora de la cita (HH:MM)

**Request a Meta API**:

```javascript
const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

const requestData = {
  messaging_product: "whatsapp",
  to: formattedPhone,
  type: "template",
  template: {
    name: "confirmacion_reserva_barberia",
    language: { code: "es" },
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: name },
          { type: "text", text: serviceName },
          { type: "text", text: formattedDate },
          { type: "text", text: time },
        ],
      },
    ],
  },
};
```

### 4. validation.service.js

**Validación de datos de entrada**

```javascript
const validateBookingData = (data) => {
  const { name, email, phone, service, date, time } = data;

  // Validar campos obligatorios
  if (!name || !email || !phone || !service || !date || !time) {
    throw createError(400, "Todos los campos son obligatorios");
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError(400, "El formato del email no es válido");
  }

  // Validar formato de teléfono chileno
  const phoneRegex = /^\+569[0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    throw createError(400, "El formato del teléfono debe ser +56 9XXXXXXXX");
  }

  // Validar servicios permitidos
  const validServices = [
    "corte-personalizado",
    "corte-barba-diarquia",
    "barba-personalizada",
    "limpieza-facial",
    "corte-tijeras",
    "camuflaje-canas",
  ];

  if (!validServices.includes(service)) {
    throw createError(400, "Servicio no válido");
  }
};
```

## Dependencias NPM

```json
{
  "axios": "^1.13.0", // Cliente HTTP para APIs externas
  "cors": "^2.8.5", // Control de CORS
  "dotenv": "^16.6.1", // Variables de entorno
  "express": "^4.21.2", // Framework web
  "express-rate-limit": "^7.5.1", // Rate limiting
  "googleapis": "^128.0.0", // SDK de Google
  "helmet": "^7.2.0" // Seguridad HTTP
}
```

## Middleware de Seguridad

### 1. CORS Configuration

```javascript
const corsOptions = {
  origin: ["http://localhost:8080", "https://clone-barber.vercel.app"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
```

### 2. Helmet (Security Headers)

```javascript
app.use(helmet());
```

### 3. Rate Limiting

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
});
```

## Manejo de Errores

### Error Handler Global

```javascript
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
  });
});
```

### Códigos de Error HTTP

| Código | Significado         | Uso                    |
| ------ | ------------------- | ---------------------- |
| `200`  | OK                  | Operación exitosa      |
| `201`  | Created             | Recurso creado         |
| `400`  | Bad Request         | Datos inválidos        |
| `401`  | Unauthorized        | Autenticación fallida  |
| `403`  | Forbidden           | Permisos insuficientes |
| `404`  | Not Found           | Ruta no existe         |
| `500`  | Server Error        | Error interno          |
| `503`  | Service Unavailable | API externa caída      |

## Scripts NPM

```json
{
  "start": "node server.js", // Producción
  "dev": "nodemon server.js", // Desarrollo
  "validate": "node validate.js", // Validar .env
  "test": "echo 'No tests yet'" // Tests (pendiente)
}
```

## Logging

### Console Logs Estructurados

```javascript
console.log("LA DIARQUÍA - SERVIDOR BACKEND");
console.log("Procesando nueva reserva:", bookingData);
console.log("Evento creado en Google Calendar:", calendarEvent.id);
console.log("Error al crear reserva:", error);
```

## Variables de Entorno Críticas

Ver `ENV_REFERENCE.md` para documentación completa.

**Mínimo requerido**:

- `PORT`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_CALENDAR_ID`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`

---

**Total líneas de código backend**: ~600 líneas
**Endpoints activos**: 3
**Servicios integrados**: 2 (Google + WhatsApp)
