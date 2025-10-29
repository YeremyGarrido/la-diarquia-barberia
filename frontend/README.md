# La Diarquía Barbería Premium — Hoja de Estilos (Refactor 2025)

## Estructura del Proyecto

/frontend/
├── styles.css
├── README.md
/docs/
└── README.md
/dev_notes/
└── DEV_NOTES.txt

yaml
Copiar código

---

## Estructura Interna del CSS

1. **Variables globales**
2. **Reset & base**
3. **Helpers `u-classes`**
4. **Componentes globales**
5. **Secciones (Header, Hero, About, etc.)**
6. **Media queries consolidadas**
7. **Dev Notes (observaciones técnicas)**

---

## Variables Globales

| Variable           | Descripción            | Ejemplo         |
| ------------------ | ---------------------- | --------------- |
| `--color-dark`     | Fondo oscuro principal | `#000000`       |
| `--color-light`    | Blanco puro            | `#ffffff`       |
| `--color-accent`   | Cobre / dorado premium | `#d4a574`       |
| `--color-gray`     | Texto secundario       | `#999999`       |
| `--font-primary`   | Tipografía base        | `'Poppins'`     |
| `--font-secondary` | Tipografía de títulos  | `'Inter'`       |
| `--transition`     | Transición global      | `all 0.3s ease` |

---

## Sistema de Utilidades `u-classes`

| Clase                             | Descripción              |
| --------------------------------- | ------------------------ |
| `.u-flex` / `.u-flex-center`      | Flexbox y centrado       |
| `.u-flex-column`                  | Columna vertical         |
| `.u-grid-2col`                    | Grid de dos columnas     |
| `.u-text-accent` / `.u-bg-accent` | Colores de marca         |
| `.u-shadow-sm/md/lg`              | Sombras consistentes     |
| `.u-p-*` / `.u-m-*`               | Espaciado predefinido    |
| `.u-transition`                   | Aplica transición global |

---

## Guía de Mantenimiento

- **HTML compatible:** no requiere cambios estructurales.
- **Optimizado:** sin prefijos obsoletos, limpio para Autoprefixer.
- **Responsivo:** breakpoints unificados (968 px y 576 px).
- **Compatibilidad:** Chrome, Edge, Safari 15+, Firefox.

---

## Preparación para SCSS Modular

Futura división sugerida:
scss/
├── \_variables.scss
├── \_helpers.scss
├── \_components.scss
├── \_layout.scss
├── sections/
│ ├── \_header.scss
│ ├── \_hero.scss
│ ├── \_about.scss
│ └── ...
└── main.scss

yaml
Copiar código

**Recomendación:** usar `@use` y `@forward` para mantener modularidad y evitar colisiones.

---

## Integración con Git y Entorno Estático

- **Repositorio:** GitHub (rama `main`)
- **Convenciones de commits:**
  - `feat:` nuevas secciones o utilidades
  - `fix:` correcciones visuales
  - `refactor:` cambios estructurales sin alterar diseño
  - `style:` ajustes de formato, espaciado o comentarios
- **Despliegue:** directo a Vercel desde `frontend/`

---

## Notas Técnicas

- Las animaciones y keyframes se migrarán a `_animations.scss`.
- Los helpers actuales (`u-classes`) serán convertidos en `@mixins`.
- Las sombras y transiciones pueden parametrizarse por nivel.
- Preparado para integración con componentes Astro/Vite.

---

## Créditos

**La Diarquía Barbería Premium**  
Diseño y desarrollo web — Equipo Full Stack 2025  
Estilo cinematográfico, premium y cálido en cobre, negro y blanco.
