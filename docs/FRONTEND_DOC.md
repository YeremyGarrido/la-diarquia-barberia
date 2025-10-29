# FRONTEND DOCUMENTATION - La Diarquía Barbería

## Estructura del Sitio Web

### Arquitectura Frontend

El frontend es una Single Page Application (SPA) estática con navegación por secciones mediante scroll. La arquitectura sigue el patrón de componentes semánticos HTML5 con separación de responsabilidades.

```
frontend/
├── index.html          # Página principal (único HTML)
├── css/
│   └── styles.css      # Estilos globales CSS3
├── js/
│   └── script.js       # Lógica de interacción
├── images/             # Assets visuales
│   ├── gallery/        # Imágenes de galería
│   ├── icons/          # Iconos SVG
│   └── testimonials/   # Avatares de testimonios
└── tokens.json         # Design tokens (colores, espaciados)
```

## Secciones del Sitio

### 1. Header & Navigation

```html
<header id="header" class="header">
  <nav class="navbar">
    <!-- Logo, menú hamburguesa mobile, enlaces -->
  </nav>
</header>
```

**Elementos**:

- Logo de la barbería
- Menú de navegación responsive
- Botón CTA "Reservar Cita"
- Menú hamburguesa para móviles

### 2. Hero Section

```html
<section id="home" class="hero">
  <!-- Fondo con overlay, título principal, CTAs -->
</section>
```

**Características**:

- Imagen de fondo con overlay oscuro
- Título principal con animación AOS
- Subtítulo y descripción
- 2 botones de acción (Reserva / Ver Servicios)
- Indicador de scroll animado

### 3. Services Section

```html
<section id="services" class="services">
  <div class="services-grid">
    <!-- 6 tarjetas de servicios -->
  </div>
</section>
```

**Servicios Ofrecidos**:

1. Corte de Cabello Personalizado
2. Barba Personalizada
3. Corte y Barba "La Diarquía"
4. Limpieza Facial FULL
5. Corte sólo a Tijeras
6. Camuflaje de Canas

### 4. About Section

```html
<section id="about" class="about">
  <!-- Imagen + texto sobre la barbería -->
</section>
```

**Contenido**:

- Imagen del local
- Badge "2 Barberos Expertos"
- Descripción de la filosofía
- Features con iconos de check
- Botón "Visítanos"

### 5. Gallery Section

```html
<section id="gallery" class="gallery">
  <div class="gallery-grid">
    <!-- 6 imágenes en grid -->
  </div>
</section>
```

### 6. Testimonials Section

```html
<section class="testimonials">
  <!-- 3 tarjetas de testimonios -->
</section>
```

### 7. Contact/Booking Form

```html
<section id="contact-form" class="contact">
  <form class="contact-form" id="contactForm">
    <!-- Campos: name, email, phone, service, date, time -->
  </form>
</section>
```

**Campos del Formulario**

| Campo     | Tipo   | Requerido | Validación                              |
| --------- | ------ | --------- | --------------------------------------- |
| `name`    | text   | Sí        | No vacío                                |
| `email`   | email  | Sí        | Formato de email válido                 |
| `phone`   | tel    | Sí        | Formato: +569XXXXXXXX                   |
| `service` | select | Sí        | Debe pertenecer a lista predefinida     |
| `date`    | text   | Sí        | Formato: YYYY-MM-DD                     |
| `time`    | select | Sí        | Debe coincidir con horarios disponibles |

### 8. Footer

```html
<footer class="footer">
  <!-- Logo, redes sociales, mapa, links, info -->
</footer>
```

## Convenciones de HTML/CSS/JS

### Nomenclatura de Clases CSS (BEM-like)

```css
/* Bloques principales */
.header {
}
.hero {
}
.services {
}
.footer {
}

/* Elementos dentro de bloques */
.hero-title {
}
.service-card {
}
.footer-logo {
}

/* Modificadores */
.btn-primary {
}
.btn-secondary {
}
.nav-link.active {
}
```

### Variables CSS (Custom Properties)

```css
:root {
  /* Colores principales */
  --color-primary: #c9a962; /* Dorado */
  --color-primary-dark: #a88943; /* Dorado oscuro */
  --color-dark: #1a1a1a; /* Negro carbón */
  --color-light: #f5f5f5; /* Gris claro */

  /* Tipografía */
  --font-primary: "Playfair Display", serif;
  --font-secondary: "Lato", sans-serif;

  /* Espaciados */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;

  /* Transiciones */
  --transition-base: 0.3s ease;
}
```

### JavaScript - script.js

**Estructura**:

```javascript
// 1. VARIABLES GLOBALES
const API_BASE = document.querySelector('meta[name="api-base"]').content;
const form = document.getElementById("contactForm");

// 2. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initApp);

// 3. FUNCIONES
function initApp() {
  setupNavigation();
  setupFormHandlers();
  setupScrollEffects();
}

// 4. EVENT HANDLERS
form.addEventListener("submit", handleFormSubmit);

// 5. UTILIDADES
function formatPhoneNumber(phone) {
  /* ... */
}
```

## Dependencias Externas

### CDN Scripts

```html
<!-- Feather Icons -->
<script src="https://unpkg.com/feather-icons"></script>

<!-- AOS (Animate On Scroll) -->
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<!-- Google Fonts -->
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700"
/>
```

## Tokens Visuales (tokens.json)

```json
{
  "colors": {
    "primary": "#c9a962",
    "secondary": "#1a1a1a",
    "accent": "#ffffff"
  },
  "typography": {
    "headings": "Playfair Display",
    "body": "Lato"
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "1rem",
    "md": "2rem",
    "lg": "4rem"
  }
}
```

## Comunicación con Backend

### Configuración API Base

```javascript
const API_BASE =
  document.querySelector('meta[name="api-base"]')?.content ||
  "http://localhost:3000/api";
```

### Petición POST - Crear Reserva

```javascript
async function createBooking(bookingData) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });

  return await response.json();
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1440px) {
  /* Large desktop */
}
```

## Animaciones

### AOS Configuration

```javascript
AOS.init({
  offset: 90,
  duration: 750,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  once: true,
});
```

### CSS Transitions

```css
.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
```

## SEO Optimization

### Meta Tags

```html
<meta
  name="description"
  content="La Diarquía - Expertos en potenciar tu imagen"
/>
<meta property="og:title" content="La Diarquía - Barbería Premium" />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

### Schema.org Markup

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "La Diarquía",
    "telephone": "+56990409061",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Almte. Pastene 70",
      "addressLocality": "Providencia"
    }
  }
</script>
```

## Optimización de Performance

1. **Lazy Loading**: `loading="lazy"` en imágenes
2. **Preconnect**: Google Fonts con `<link rel="preconnect">`
3. **Defer Scripts**: `<script defer>` para scripts no críticos
4. **Minificación**: CSS y JS minificados en producción
5. **Imágenes Optimizadas**: WebP con fallback a PNG

## Accesibilidad (A11y)

- ARIA labels en botones e iconos
- Roles semánticos (`<nav>`, `<main>`, `<footer>`)
- Contraste de colores WCAG AA
- Navegación por teclado
- Screen reader friendly

---

**Total líneas de código**: ~1500 líneas (HTML + CSS + JS)
**Última actualización**: 2024
