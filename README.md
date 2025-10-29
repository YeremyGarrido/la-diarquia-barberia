# La Diarquía Barbería - Sistema de Reservas

Sistema web completo para gestión de reservas con integración a Google Calendar y WhatsApp Business API.

![Estado](https://img.shields.io/badge/Estado-85%25%20Completo-yellow)
![Backend](https://img.shields.io/badge/Backend-100%25-success)
![Frontend](https://img.shields.io/badge/Frontend-60%25-orange)

---

## Descripción

Sistema de reservas online para La Diarquía Barbería que permite:

- Agendar citas a través de formulario web
- Sincronización automática con Google Calendar
- Confirmación instantánea por WhatsApp
- Validación de datos en tiempo real
- Interfaz responsive y moderna

---

## Arquitectura

### Backend (Node.js + Express)

```
backend/
├── src/
│   ├── controllers/     → Manejo de HTTP requests
│   ├── services/        → Lógica de negocio
│   └── routes/          → Definición de endpoints
├── server.js           → Servidor Express
└── package.json        → Dependencias
```

**Principios aplicados:**

- Separation of Concerns
- Single Responsibility
- Clean Architecture
- Error Handling centralizado

### Frontend (HTML + CSS + Vanilla JS)

```
frontend/
├── css/                → Estilos compilados
├── scss/               → Código fuente Sass
├── js/                 → Lógica de aplicación
├── images/             → Assets estáticos
└── index.html          → Página principal
```

**Características:**

- Design System consistente
- Animaciones con AOS
- Responsive design
- SEO optimizado
- Accesibilidad (ARIA labels)

---

## Inicio Rápido

### Prerrequisitos

- Node.js 16+ instalado
- NPM o Yarn
- Credenciales de Google Calendar Service Account
- Token de WhatsApp Business API

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/la-diarquia-barberia.git
cd la-diarquia-barberia
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

### 3. Configurar Frontend

**Opción A: Live Server (VSCode)**

1. Instalar extensión "Live Server"
2. Abrir `frontend/index.html`
3. Click derecho → "Open with Live Server"

**Opción B: http-server**

```bash
cd frontend
npx http-server -p 8080
```

### 4. Abrir en navegador

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api

---

## Configuración

### Variables de Entorno

Crear archivo `backend/.env` basado en `.env.example`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Google Calendar API
GOOGLE_CLIENT_EMAIL=tu-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GOOGLE_CALENDAR_ID=tu-calendar-id@group.calendar.google.com
GOOGLE_PROJECT_ID=tu-project-id
GOOGLE_PRIVATE_KEY_ID=tu-private-key-id
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_CERT_URL=tu-cert-url

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=tu-phone-number-id
WHATSAPP_ACCESS_TOKEN=tu-access-token
```

### Configurar Google Calendar

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Google Calendar API
3. Crear Service Account
4. Descargar credenciales JSON
5. Compartir calendar con email del Service Account
6. Copiar valores a `.env`

### Configurar WhatsApp Business API

1. Crear cuenta en [Meta for Developers](https://developers.facebook.com/)
2. Crear app de WhatsApp Business
3. Obtener Phone Number ID
4. Generar Access Token
5. Crear plantilla de mensaje "confirmacion_reserva_barberia"
6. Copiar valores a `.env`

---

## API Endpoints

### POST /api/bookings

Crear una nueva reserva.

**Request Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+56912345678",
  "service": "corte-personalizado",
  "date": "2025-11-15",
  "time": "15:00"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "booking": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+56912345678",
      "service": "corte-personalizado",
      "date": "2025-11-15",
      "time": "15:00"
    },
    "googleCalendar": {
      "id": "event-id",
      "htmlLink": "https://calendar.google.com/...",
      "status": "confirmed"
    },
    "whatsapp": {
      "messageId": "wamid.xxx",
      "status": "sent"
    }
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "Error de validación",
  "error": "El formato del email no es válido"
}
```

---

## Testing

### Backend

```bash
cd backend
npm test                 # Ejecutar todos los tests
npm run test:watch       # Modo watch
npm run test:coverage    # Reporte de cobertura
```

### Frontend

```bash
cd frontend
npm test                 # Tests unitarios
npm run test:e2e         # Tests end-to-end
```

---

## Dependencias

### Backend

| Paquete    | Versión  | Propósito                 |
| ---------- | -------- | ------------------------- |
| express    | ^4.18.0  | Framework web             |
| cors       | ^2.8.5   | Middleware CORS           |
| dotenv     | ^16.0.0  | Variables de entorno      |
| googleapis | ^105.0.0 | Google Calendar API       |
| axios      | ^1.4.0   | HTTP client para WhatsApp |

### Frontend

| Librería      | Versión | Propósito                            |
| ------------- | ------- | ------------------------------------ |
| AOS           | 2.3.1   | Animaciones on scroll                |
| Feather Icons | -       | Iconos SVG                           |
| Google Fonts  | -       | Tipografías (Playfair Display, Lato) |

---

## Scripts Disponibles

### Backend

```bash
npm start           # Iniciar en producción
npm run dev         # Iniciar en desarrollo (nodemon)
npm test            # Ejecutar tests
npm run lint        # Ejecutar ESLint
npm run format      # Formatear con Prettier
```

### Frontend

```bash
npm run build       # Compilar SCSS a CSS
npm run watch       # Watch mode para SCSS
npm run serve       # Servir archivos estáticos
```

---

## Estructura del Proyecto

```
la-diarquia-barberia/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── bookings.controller.js
│   │   ├── services/
│   │   │   ├── booking.service.js
│   │   │   ├── validation.service.js
│   │   │   ├── googleCalendar.service.js
│   │   │   └── whatsapp.service.js
│   │   └── routes/
│   │       └── bookings.routes.js
│   ├── tests/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── scss/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── main.scss
│   ├── js/
│   │   └── script.js
│   ├── images/
│   │   ├── logo.png
│   │   └── gallery/
│   └── index.html
│
├── docs/
│   ├── MIGRACION_REPORTE.md
│   ├── GUIA_FINALIZACION.md
│   ├── RESUMEN_EJECUTIVO.md
│   └── COMANDOS_RAPIDOS.md
│
└── README.md
```

---

## Servicios Disponibles

1. **Corte de Cabello Personalizado**

   - Asesoría de imagen incluida
   - Adaptado a facciones y estilo

2. **Barba Personalizada**

   - Toallas calientes
   - Productos premium

3. **Corte y Barba "La Diarquía"**

   - Experiencia premium
   - Ritual completo con vapor de ozono

4. **Limpieza Facial FULL**

   - Purificación profunda
   - Revitalización de piel

5. **Corte sólo a Tijeras**

   - Ideal para cabello largo
   - Looks modernos (Wolf Cut, Shaggy)

6. **Camuflaje de Canas**
   - Cobertura natural
   - Para barba y cabello

---

## Seguridad

- Validación de datos en backend
- Variables de entorno para secrets
- CORS configurado apropiadamente
- Rate limiting (pendiente implementar)
- Sanitización de inputs
- HTTPS en producción (pendiente)
- Autenticación para admin panel (pendiente)

---

## Deployment

### Backend (Railway/Fly.io)

```bash
# Railway
railway login
railway init
railway up

# Fly.io
fly launch
fly deploy
```

### Frontend (Vercel/Netlify)

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### Variables de Entorno en Producción

No olvides configurar las variables de entorno en tu plataforma de hosting:

- Google Calendar credentials
- WhatsApp API credentials
- CORS allowed origins

---

## Estado del Proyecto

### Completado

- Backend arquitectura y lógica
- Integración Google Calendar
- Integración WhatsApp Business API
- Validación de datos
- Frontend JavaScript
- Frontend HTML estructura

### En Progreso

- Copiar assets frontend (CSS, imágenes)
- Tests unitarios
- Tests de integración

### Pendiente

- Panel de administración
- Sistema de autenticación
- Dashboard de métricas
- Email notifications
- Sistema de recordatorios
- Gestión de horarios disponibles

---

## Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones de Commits

```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Documentación
style: Formato, sin cambios de código
refactor: Refactorización de código
test: Tests
chore: Mantenimiento
```

---

## Documentación Adicional

- [MIGRACION_REPORTE.md](./MIGRACION_REPORTE.md) - Reporte detallado de migración
- [GUIA_FINALIZACION.md](./GUIA_FINALIZACION.md) - Pasos para completar setup
- [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md) - Visión general del proyecto
- [COMANDOS_RAPIDOS.md](./COMANDOS_RAPIDOS.md) - Scripts útiles

---

## Problemas Conocidos

1. **Horarios disponibles:** Actualmente son estáticos, pendiente implementar verificación en Google Calendar
2. **Zona horaria:** Configurada para America/Santiago, ajustar según ubicación
3. **Rate limiting:** No implementado, considerar para producción

---

## Contacto

**La Diarquía Barbería**

- Almte. Pastene 70, Providencia, Santiago, Chile
- WhatsApp: +56 9 9040 9061
- Email: ladiarquiabarberia@gmail.com
- Instagram: [@ladiarquia.barberia](https://www.instagram.com/ladiarquia.barberia/)

---

## Licencia

Este proyecto es propiedad privada de La Diarquía Barbería. Todos los derechos reservados.

---

## Agradecimientos

- Equipo de desarrollo
- Google Calendar API
- Meta WhatsApp Business API
- Comunidad open source

---

_Última actualización: 27 de Octubre, 2025_
