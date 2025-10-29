# README - Documentación Técnica

## Índice de Documentación

Este directorio contiene la documentación técnica completa del proyecto **La Diarquía Barbería**.

### Documentos Disponibles

| Documento                                    | Descripción                        | Contenido                                                       |
| -------------------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Resumen general del sistema        | Arquitectura, stack tecnológico, estructura, flujo de trabajo   |
| [FRONTEND_DOC.md](./FRONTEND_DOC.md)         | Documentación del frontend         | Estructura HTML, CSS, JavaScript, convenciones, tokens visuales |
| [BACKEND_DOC.md](./BACKEND_DOC.md)           | Documentación del backend          | Rutas, controladores, servicios, dependencias NPM, Node.js      |
| [ENV_REFERENCE.md](./ENV_REFERENCE.md)       | Referencia de variables de entorno | Todas las variables con descripción, formato y ejemplos         |
| [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)         | Guía de despliegue                 | Paso a paso para Vercel (frontend) y Fly.io (backend)           |
| [CHANGELOG.md](./CHANGELOG.md)               | Registro de cambios                | Historial de versiones, features, y pendientes                  |
| **README.md**                                | Este archivo                       | Índice general de documentación                                 |

---

## Quick Start

### Para desarrolladores nuevos:

1. Leer [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) primero
2. Configurar variables de entorno según [ENV_REFERENCE.md](./ENV_REFERENCE.md)
3. Revisar [BACKEND_DOC.md](./BACKEND_DOC.md) y [FRONTEND_DOC.md](./FRONTEND_DOC.md)
4. Seguir [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) para desplegar

---

## Resumen del Proyecto

- **Nombre**: La Diarquía Barbería
- **Tipo**: Sistema de Reservas Web
- **Versión**: 1.0.0
- **Stack**: Node.js + Express | HTML5 + CSS3 + JS Vanilla
- **Integraciones**: Google Calendar API + WhatsApp Business API
- **Hosting**: Vercel (frontend) + Fly.io (backend)

---

## Estructura de /docs

```
docs/
├── PROJECT_OVERVIEW.md       # Resumen general
├── FRONTEND_DOC.md           # Documentación frontend
├── BACKEND_DOC.md            # Documentación backend
├── ENV_REFERENCE.md          # Variables de entorno
├── DEPLOY_GUIDE.md           # Guía de despliegue
├── CHANGELOG.md              # Historial de cambios
└── README.md                 # Este archivo (índice)

Total: 7 archivos de documentación
```

---

## Información Clave

### Endpoints Backend

- `GET /` - Info de la API
- `GET /health` - Health check
- `POST /api/bookings` - Crear reserva

### URLs de Producción

- **Frontend**: https://clone-barber.vercel.app
- **Backend**: https://la-diarquia-backend.fly.dev

### Tecnologías Principales

- Node.js 18+
- Express.js 4.x
- Google Calendar API v3
- WhatsApp Business API (Meta)

---

## Contacto Técnico

Para dudas técnicas o contribuciones:

- **Email**: ladiarquiabarberia@gmail.com
- **Ubicación**: Almte. Pastene 70, Providencia, Santiago

---

**Última Actualización**: 2024-10-29
