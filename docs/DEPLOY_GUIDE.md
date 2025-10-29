# DEPLOY GUIDE - La Diarquía Barbería

## Despliegue Frontend (Vercel)

### Preparación

```bash
cd frontend/
# Verificar que index.html exista
ls index.html css/ js/ images/
```

### Deploy en Vercel

#### Opción 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Opción 2: GitHub Integration

1. Push código a GitHub
2. Importar repo en Vercel Dashboard
3. Configurar:
   - **Framework**: Other
   - **Root Directory**: `frontend/`
   - **Output Directory**: `./`
4. Deploy automático

### Configuración vercel.json

```json
{
  "version": 2,
  "builds": [{ "src": "frontend/**", "use": "@vercel/static" }],
  "routes": [{ "src": "/(.*)", "dest": "frontend/index.html" }]
}
```

### Post-Deploy

1. Actualizar meta tag en `index.html`:

```html
<meta name="api-base" content="https://la-diarquia-backend.fly.dev/api" />
```

2. Verificar CORS en backend permite la URL de Vercel

---

## Despliegue Backend (Fly.io)

### Requisitos

- Cuenta en Fly.io
- `flyctl` CLI instalado
- Backend funcional localmente

### Instalación Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Login

```bash
flyctl auth login
```

### Crear App

```bash
cd backend/
flyctl launch

# Responder:
# - App name: la-diarquia-backend
# - Region: scl (Santiago)
# - PostgreSQL: No
# - Redis: No
```

### Configurar fly.toml

```toml
app = "la-diarquia-backend"
primary_region = "scl"

[build]
  image = "flyio/node:20"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### Configurar Secrets

```bash
# Google Calendar
flyctl secrets set GOOGLE_CLIENT_EMAIL="tu-email@proyecto.iam.gserviceaccount.com"
flyctl secrets set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
flyctl secrets set GOOGLE_CALENDAR_ID="primary"

# WhatsApp
flyctl secrets set WHATSAPP_PHONE_NUMBER_ID="123456789"
flyctl secrets set WHATSAPP_ACCESS_TOKEN="EAA..."

# Frontend URL
flyctl secrets set FRONTEND_URL="https://clone-barber.vercel.app"
```

### Deploy

```bash
flyctl deploy
```

### Verificar Deploy

```bash
flyctl status
flyctl logs
curl https://la-diarquia-backend.fly.dev/health
```

---

## Estructura Esperada Post-Deploy

```
Production Environment:
├── Frontend
│   ├── URL: https://clone-barber.vercel.app
│   ├── Host: Vercel
│   └── Build: Static files
│
└── Backend
    ├── URL: https://la-diarquia-backend.fly.dev
    ├── Host: Fly.io
    ├── Region: Santiago (scl)
    └── Port: 8080
```

---

## Comandos Básicos de Gestión

### Vercel

```bash
vercel --prod              # Deploy a producción
vercel ls                  # Listar deployments
vercel logs                # Ver logs
vercel env ls              # Listar variables de entorno
vercel domains add <url>   # Agregar dominio custom
```

### Fly.io

```bash
flyctl deploy              # Deploy actualización
flyctl status              # Estado de la app
flyctl logs                # Ver logs en tiempo real
flyctl logs -a <app>       # Logs de app específica
flyctl scale count 2       # Escalar a 2 instancias
flyctl ssh console         # SSH a la VM
flyctl secrets list        # Listar secrets
flyctl secrets unset VAR   # Eliminar secret
```

---

## Testing Post-Deploy

### 1. Health Check Backend

```bash
curl https://la-diarquia-backend.fly.dev/health
```

**Respuesta esperada**:

```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2024-10-29T12:00:00.000Z",
  "environment": "production"
}
```

### 2. Test Reserva

```bash
curl -X POST https://la-diarquia-backend.fly.dev/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+56912345678",
    "service": "corte-personalizado",
    "date": "2024-11-01",
    "time": "15:00"
  }'
```

### 3. Test Frontend

1. Abrir https://clone-barber.vercel.app
2. Navegar a sección de contacto
3. Completar formulario
4. Verificar mensaje de éxito

---

## Rollback

### Vercel

```bash
vercel rollback            # Ver deployments previos
vercel rollback <url>      # Rollback a deployment específico
```

### Fly.io

```bash
flyctl releases            # Ver releases previas
flyctl releases rollback   # Rollback a versión anterior
```

---

## Monitoreo

### Logs en Tiempo Real

```bash
# Vercel
vercel logs --follow

# Fly.io
flyctl logs -f
```

### Métricas

- **Vercel**: Dashboard > Analytics
- **Fly.io**: Dashboard > Metrics

---

## Troubleshooting

### Error: CORS en frontend

```javascript
// Verificar en backend/server.js
const corsOptions = {
  origin: ["https://clone-barber.vercel.app"],
};
```

### Error: 503 Backend

```bash
flyctl status       # Verificar que app esté running
flyctl logs         # Ver logs de error
flyctl deploy       # Re-deploy si es necesario
```

### Error: Variables de Entorno

```bash
flyctl secrets list  # Verificar secrets
flyctl secrets set VAR="value"  # Agregar/actualizar
```

---

**Plataformas**: Vercel (frontend) + Fly.io (backend)
**Región Backend**: Santiago (scl)
**Tiempo de Deploy**: ~5 minutos (cada uno)
