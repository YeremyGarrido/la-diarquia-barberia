# ENVIRONMENT VARIABLES REFERENCE

## Variables de Entorno del Backend

### General Configuration

#### `NODE_ENV`

- **Tipo**: `string`
- **Valores**: `development` | `production`
- **Requerido**: No (default: `development`)
- **Descripción**: Entorno de ejecución del servidor
- **Ejemplo**: `NODE_ENV=production`

#### `PORT`

- **Tipo**: `number`
- **Requerido**: No (default: `3000`)
- **Descripción**: Puerto donde escucha el servidor
- **Ejemplo**: `PORT=8080`

#### `FRONTEND_URL`

- **Tipo**: `string` (URL)
- **Requerido**: Sí (para CORS)
- **Descripción**: URL del frontend permitida en CORS
- **Ejemplo**: `FRONTEND_URL=https://clone-barber.vercel.app`

---

## Google Calendar API

### `GOOGLE_CLIENT_EMAIL`

- **Tipo**: `string` (email)
- **Requerido**: Sí
- **Descripción**: Email de la Service Account de Google
- **Formato**: `service-account@project-id.iam.gserviceaccount.com`
- **Ejemplo**: `GOOGLE_CLIENT_EMAIL=reservas@la-diarquia.iam.gserviceaccount.com`
- **Dónde obtenerlo**:
  1. Google Cloud Console
  2. IAM & Admin > Service Accounts
  3. Crear/seleccionar cuenta
  4. Copiar email

### `GOOGLE_PRIVATE_KEY`

- **Tipo**: `string` (RSA Private Key)
- **Requerido**: Sí
- **Descripción**: Clave privada de la Service Account (JSON key file)
- **Formato**: `"-----BEGIN PRIVATE KEY-----\nXXX...\n-----END PRIVATE KEY-----\n"`
- **Importante**: Debe incluir `\n` literales (escapados) para saltos de línea
- **Ejemplo**:

```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
```

- **Dónde obtenerlo**:
  1. Service Account > Keys tab
  2. Add Key > Create new key > JSON
  3. Descargar archivo JSON
  4. Extraer campo `private_key`

### `GOOGLE_CALENDAR_ID`

- **Tipo**: `string`
- **Requerido**: Sí
- **Descripción**: ID del calendario de Google donde se crearán los eventos
- **Valores**: `primary` (calendario principal) o ID específico
- **Ejemplo**: `GOOGLE_CALENDAR_ID=primary`
- **Dónde obtenerlo**:
  1. Google Calendar > Settings
  2. Seleccionar calendario
  3. Copiar "Calendar ID"

---

## WhatsApp Business API (Meta)

### `WHATSAPP_PHONE_NUMBER_ID`

- **Tipo**: `string` (número)
- **Requerido**: Sí
- **Descripción**: ID del número de teléfono de WhatsApp Business
- **Formato**: Número sin espacios ni símbolos
- **Ejemplo**: `WHATSAPP_PHONE_NUMBER_ID=123456789012345`
- **Dónde obtenerlo**:
  1. Meta Business Suite
  2. WhatsApp > API Setup
  3. Copiar "Phone Number ID"

### `WHATSAPP_ACCESS_TOKEN`

- **Tipo**: `string` (Bearer Token)
- **Requerido**: Sí
- **Descripción**: Token de acceso permanente de WhatsApp Business API
- **Formato**: `EAAxxxxxxxxxxxxxxxxxx` (empieza con EAA)
- **Duración**: Permanente (no expira)
- **Ejemplo**: `WHATSAPP_ACCESS_TOKEN=EAABsbCS1iHgBO7ZCPEw9bBfRfZCz...`
- **Dónde obtenerlo**:
  1. Meta Business Suite
  2. WhatsApp > API Setup
  3. Generate Access Token (permanent)
  4. Guardar token de forma segura

---

## Archivo .env.example

```bash
# ==================================
# CONFIGURACIÓN GENERAL
# ==================================
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://tu-dominio.vercel.app

# ==================================
# GOOGLE CALENDAR API
# ==================================
GOOGLE_CLIENT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

# ==================================
# WHATSAPP BUSINESS API (META)
# ==================================
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAABsbCS1iHgBO...
```

---

## Validación de Variables

### Script de Validación (validate.js)

```javascript
const required = [
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_CALENDAR_ID",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_ACCESS_TOKEN",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error("Faltan variables de entorno:", missing.join(", "));
  process.exit(1);
}

console.log("Todas las variables de entorno están configuradas");
```

---

## Seguridad

### NUNCA subir a Git

- Archivo `.env` debe estar en `.gitignore`
- No compartir credenciales en repos públicos
- Usar variables de entorno en plataformas de hosting (Fly.io, Vercel)

### Fly.io Secrets

```bash
fly secrets set GOOGLE_PRIVATE_KEY="-----BEGIN..."
fly secrets set WHATSAPP_ACCESS_TOKEN="EAA..."
fly secrets list
```

### Vercel Environment Variables

```bash
vercel env add GOOGLE_CLIENT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY
```

---

## Troubleshooting

### Google Calendar: 401 Unauthorized

- Verificar que `GOOGLE_CLIENT_EMAIL` sea correcto
- Verificar que `GOOGLE_PRIVATE_KEY` tenga `\n` literales
- Service Account debe tener permisos en el calendario

### Google Calendar: 403 Forbidden

- Compartir calendario con `GOOGLE_CLIENT_EMAIL`
- Otorgar permisos de "Make changes to events"

### WhatsApp: 401/403

- Token debe ser permanente (no temporal)
- Verificar que el token no haya expirado
- Business App debe tener permisos de WhatsApp

### WhatsApp: 404

- `WHATSAPP_PHONE_NUMBER_ID` debe ser el ID, no el número
- Número debe estar verificado en Meta

---

**Total Variables**: 8 (3 generales + 3 Google + 2 WhatsApp)
**Variables Críticas**: 5
