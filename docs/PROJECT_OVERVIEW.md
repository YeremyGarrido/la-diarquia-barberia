# PROJECT OVERVIEW - La Diarquía Barbería

## Resumen General del Sistema

La Diarquía Barbería es una aplicación web completa de reservas para servicios de barbería premium. El sistema integra un sitio web estático (frontend) con un backend Node.js que gestiona reservas mediante Google Calendar API y envía confirmaciones automatizadas vía WhatsApp Business API.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    ARQUITECTURA GENERAL                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌────────────────┐            │
│  │   FRONTEND   │────────▶│    BACKEND     │            │
│  │  (Vercel)    │  HTTPS  │   (Fly.io)     │            │
│  │              │◀────────│                │            │
│  └──────────────┘         └────────┬───────┘            │
│       │                             │                    │
│       │                    ┌────────┴──────────┐         │
│       │                    │                   │         │
│       │               ┌────▼──────┐      ┌────▼────┐   │
│   [Usuario]           │  Google   │      │WhatsApp │   │
│   Navegador           │ Calendar  │      │   API   │   │
│                       │    API    │      │  (Meta) │   │
│                       └───────────┘      └─────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Componentes Principales

| Componente      | Tecnología                      | Propósito                                    | Hosting       |
| --------------- | ------------------------------- | -------------------------------------------- | ------------- |
| Frontend        | HTML5, CSS3, JavaScript Vanilla | Interfaz de usuario estática y responsiva    | Vercel        |
| Backend API     | Node.js + Express.js            | Gestión de lógica de negocio y APIs externas | Fly.io        |
| Google Calendar | Google Calendar API v3          | Almacenamiento de reservas y eventos         | Google Cloud  |
| WhatsApp        | WhatsApp Business API (Meta)    | Notificaciones automáticas a clientes        | Meta Platform |

## Stack Tecnológico

### Frontend

- HTML5: Estructura semántica con SEO optimizado
- CSS3: Estilos modernos con Flexbox/Grid y animaciones
- JavaScript ES6+: Interactividad y comunicación con backend
- AOS (Animate On Scroll): Animaciones al hacer scroll
- Feather Icons: Iconografía vectorial SVG

### Backend

- Node.js 18+: Entorno de ejecución JavaScript
- Express.js 4.x: Framework web minimalista
- Axios 1.x: Cliente HTTP para APIs externas
- googleapis 128.x: SDK oficial de Google
- dotenv 16.x: Gestión de variables de entorno
- cors 2.x: Política de recursos cruzados
- helmet 7.x: Seguridad HTTP
- express-rate-limit 7.x: Protección contra abuso de API

## Estructura de Carpetas

```
la-diarquia-barberia/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   ├── node_modules/
│   └── src/
│       ├── controllers/
│       │   └── bookings.controller.js
│       ├── routes/
│       │   └── bookings.routes.js
│       └── services/
│           ├── booking.service.js
│           ├── googleCalendar.service.js
│           ├── whatsapp.service.js
│           └── validation.service.js
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   ├── images/
│   └── tokens.json
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── FRONTEND_DOC.md
│   ├── BACKEND_DOC.md
│   ├── ENV_REFERENCE.md
│   ├── DEPLOY_GUIDE.md
│   ├── CHANGELOG.md
│   └── README.md
├── fly.toml
├── vercel.json
└── README.md

Total: 43 archivos principales (excluyendo node_modules e imágenes)
```

## Flujo de Trabajo de Reserva

```
1. Usuario completa formulario en frontend
        ↓
2. Frontend valida datos (cliente)
        ↓
3. POST /api/bookings → Backend API
        ↓
4. Backend valida datos (servidor)
        ↓
5. Creación de evento en Google Calendar
        ↓
6. Envío de confirmación por WhatsApp
        ↓
7. Respuesta JSON al frontend
        ↓
8. Notificación visual al usuario
```

## Propósito del Sistema

### Objetivos Principales

1. Automatización de Reservas: Eliminar gestión manual de citas
2. Experiencia de Usuario Premium: Interfaz moderna y fluida
3. Notificaciones Instantáneas: Confirmación inmediata vía WhatsApp
4. Integración con Google Calendar: Gestión centralizada de agenda
5. Escalabilidad: Arquitectura preparada para crecimiento

### Funcionalidades Clave

- Formulario de reserva con validación en tiempo real
- Calendario interactivo con horarios disponibles
- Integración automática con Google Calendar
- Confirmación de reserva por WhatsApp
- Diseño responsive (mobile-first)
- SEO optimizado con Schema.org markup
- Rate limiting y seguridad HTTP (Helmet)
- Gestión de errores centralizada

## Endpoints Principales del Backend

| Método | Ruta          | Descripción               | Autenticación |
| ------ | ------------- | ------------------------- | ------------- |
| GET    | /             | Información de la API     | No            |
| GET    | /health       | Health check del servidor | No            |
| POST   | /api/bookings | Crear nueva reserva       | No            |

## Variables de Entorno Requeridas

### Backend (.env)

```bash
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://clone-barber.vercel.app

# Google Calendar API
GOOGLE_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

# WhatsApp Business API (Meta)
WHATSAPP_PHONE_NUMBER_ID=1234567890
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxx
```

## Convenciones de Código

### Nombres de Variables

- camelCase: Variables y funciones (bookingData, createEvent)
- PascalCase: Clases y componentes (no aplicable en este proyecto)
- UPPER_SNAKE_CASE: Constantes de entorno (GOOGLE_CALENDAR_ID)
- kebab-case: Rutas y valores de servicio (corte-personalizado)

### Estructura de Respuestas API

```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "bookingId": "abc123",
    "calendarEventId": "xyz789",
    "whatsappMessageId": "wamid.xxx"
  }
}
```

### Manejo de Errores

```json
{
  "success": false,
  "message": "Error al procesar la solicitud",
  "details": "Mensaje de error específico"
}
```

## Dependencias Críticas

### Backend - package.json

```json
{
  "dependencies": {
    "axios": "^1.13.0",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.1",
    "googleapis": "^128.0.0",
    "helmet": "^7.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## Seguridad Implementada

1. Helmet.js: Headers de seguridad HTTP
2. CORS: Control de orígenes permitidos
3. Express Rate Limit: Protección contra DDoS
4. Validación de Datos: Sanitización de inputs
5. Variables de Entorno: Credenciales fuera del código
6. HTTPS Obligatorio: Comunicación encriptada

## Métricas del Proyecto

- Total de Archivos: 43 archivos (código fuente)
- Tamaño del Proyecto: aproximadamente 14 MB (incluye imágenes)
- Dependencias NPM: 8 paquetes principales
- Endpoints API: 3 rutas públicas
- Servicios Externos: 2 (Google Calendar, WhatsApp)
- Tiempo de Respuesta Promedio: menor a 2 segundos

## Estado Actual

Funcional y Desplegado

- Frontend: Vercel (https://clone-barber.vercel.app)
- Backend: Fly.io (https://la-diarquia-backend.fly.dev)

## Próximas Mejoras Sugeridas

1. Sistema de autenticación para panel de administración
2. Dashboard para gestionar reservas desde el navegador
3. Recordatorios automáticos 24h antes de la cita
4. Sistema de cancelación de reservas
5. Integración con pasarela de pagos
6. Tests automatizados (Jest/Mocha)
7. Logging avanzado (Winston/Morgan)
8. Métricas de rendimiento (New Relic/Datadog)

---

Última actualización: 2024-10-29
Versión del Proyecto: 1.0.0
