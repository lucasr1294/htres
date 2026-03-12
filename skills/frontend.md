# SKILL: Frontend Design System

## Identidad visual
**Concepto**: "Bauhaus industrial meets material luxury"
La app debe sentirse como el showroom digital de los productos que vende: precisión técnica, materiales nobles, sin ornamento innecesario. Cada componente debe comunicar calidad y modernidad sin gritar.

**Público**: joven, urbano, con gusto por el diseño. No tolera lo genérico.

---

## Tipografía

### Fuentes
```css
/* Importar en globals.css */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
```

| Rol               | Fuente         | Peso    | Uso                                      |
|-------------------|----------------|---------|------------------------------------------|
| Display / Títulos | **Syne**       | 700–800 | Headings de página, nombres de módulos   |
| UI / Cuerpo       | **IBM Plex Sans** | 300–500 | Labels, datos, párrafos, navegación   |
| Datos técnicos    | **IBM Plex Mono** | 400  | SKUs, números de tracking, cantidades    |

### Escala tipográfica
```css
--text-xs:   0.75rem;   /* labels, metadata */
--text-sm:   0.875rem;  /* body secundario */
--text-base: 1rem;      /* body principal */
--text-lg:   1.125rem;  /* subtítulos */
--text-xl:   1.25rem;   /* títulos de sección */
--text-2xl:  1.5rem;    /* títulos de página */
--text-4xl:  2.25rem;   /* display / hero */
```

### Reglas tipográficas
- Títulos de página en Syne 700, tracking normal o ligeramente expandido
- Labels de datos en IBM Plex Sans 500, uppercase, letter-spacing: 0.08em
- SKUs y números en IBM Plex Mono siempre
- Nunca usar bold en IBM Plex Sans para cuerpo — usar peso 500 máximo

---

## Paleta de colores

```css
:root {
  /* Fondos */
  --color-bg:           #F8F7F4;   /* blanco hueso — fondo de página */
  --color-surface:      #FFFFFF;   /* blanco puro — cards, panels */
  --color-surface-alt:  #F0EDE8;   /* mármol claro — cards especiales */

  /* Aluminio */
  --color-metal-light:  #D6D7D9;   /* aluminio claro — bordes, dividers */
  --color-metal:        #A8AAAE;   /* aluminio medio — iconos secundarios */
  --color-metal-dark:   #6B6D72;   /* aluminio oscuro — texto secundario */

  /* Texto */
  --color-text:         #111111;   /* casi negro — texto principal */
  --color-text-secondary: #6B6D72; /* gris medio — metadata, labels */
  --color-text-muted:   #A8AAAE;   /* gris claro — placeholders */

  /* Acción */
  --color-accent:       #111111;   /* negro — botones primarios, CTAs */
  --color-accent-hover: #2C2C2C;   /* negro suavizado — hover */

  /* Estados */
  --color-alert:        #1A1A1A;   /* stock bajo — negro con badge */
  --color-success:      #3D5A3E;   /* verde oscuro apagado — recibido */
  --color-warning:      #7A5C2E;   /* ámbar oscuro — en tránsito */
  --color-error:        #5C2E2E;   /* rojo oscuro — cancelado */

  /* Bordes */
  --color-border:       #E2E0DC;   /* borde estándar */
  --color-border-strong:#C8C9CB;   /* borde enfatizado */
}
```

### Uso de color
- El fondo de página es siempre `--color-bg` (hueso), nunca blanco puro
- Las cards usan `--color-surface` (blanco) — crean contraste sutil con el fondo
- Cards especiales o de métricas clave pueden usar `--color-surface-alt` (mármol)
- **Nunca** usar colores brillantes (azules eléctricos, verdes neón, rojos vivos)
- Los estados de las órdenes van en variantes oscuras y apagadas, no saturadas

---

## Geometría y espaciado

### Bordes
```css
--radius-sm:   2px;    /* inputs, badges */
--radius-base: 4px;    /* cards, botones */
--radius-lg:   6px;    /* modales, panels grandes */
/* NUNCA usar más de 6px salvo elementos decorativos */
```

### Bordes (border)
- Cards: `border: 1px solid var(--color-border)`
- Sin sombras difusas (`box-shadow` con blur) — preferir bordes definidos
- Si se necesita elevación, usar `box-shadow: 2px 2px 0px var(--color-border-strong)` — sombra sólida, sin blur

### Espaciado
```css
/* Usar múltiplos de 4 o 8 */
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-6:  24px
--space-8:  32px
--space-12: 48px
--space-16: 64px
```

- Padding interno de cards: `24px`
- Gap entre cards en grid: `16px`
- Padding de página: `32px` desktop, `16px` mobile

---

## Componentes clave

### Cards de métricas (dashboard)
```
┌─────────────────────────────┐
│  VALOR INVENTARIO            │  ← label: IBM Plex Sans 500, uppercase, 11px, metal
│                              │
│  $128,400                    │  ← valor: Syne 700, 32px, text
│  USD                         │  ← unidad: IBM Plex Mono, 13px, metal
│                              │
│  ↑ 12% vs mes anterior       │  ← variación: IBM Plex Sans 300, 12px
└─────────────────────────────┘
- Fondo: surface-alt (mármol) para la primera card, surface para el resto
- Sin border-radius salvo 4px
- Borde izquierdo de 2px en --color-accent para la card destacada
```

### Tabla de stock
```
- Header: uppercase, IBM Plex Sans 500, 11px, letter-spacing 0.08em, color metal-dark
- Filas: IBM Plex Sans 400, 14px
- SKUs y cantidades: IBM Plex Mono 400
- Fila con alerta de stock: borde izquierdo 2px solid --color-alert
- Hover de fila: background #F5F4F1
- Sin zebra striping — separación solo con border-bottom 1px
```

### Badges de estado de órdenes
```
- Sin border-radius (cuadrados)
- Padding: 3px 8px
- Fuente: IBM Plex Sans 500, 11px, uppercase
- BORRADOR:        bg #F0EDE8, text #6B6D72
- CONFIRMADA:      bg #E8EDF0, text #2E4A5C
- EN_PRODUCCION:   bg #F0EDE0, text #5C4A2E
- EN_TRANSITO:     bg #EDE8D8, text #7A5C2E
- EN_ADUANA:       bg #E8E0D0, text #7A5C2E
- RECIBIDA:        bg #E0EDE0, text #3D5A3E
- CANCELADA:       bg #EDE0E0, text #5C2E2E
```

### Botones
```
- Primario: bg negro, texto blanco, 0px radius, padding 10px 20px
- Secundario: bg transparente, borde 1px negro, texto negro
- Ghost: sin borde, texto metal-dark, hover: bg #F0EDE8
- Sin sombras, sin gradientes
- Hover: opacity 0.85 en primario, bg fill en secundario
```

### Navegación lateral (sidebar)
```
- Fondo: #111111 (negro)
- Texto: #A8AAAE (aluminio)
- Item activo: texto blanco, borde izquierdo 2px solid white
- Logo/nombre: Syne 700, blanco
- Íconos: Lucide, strokeWidth 1.5 (no bold)
- Sin bordes redondeados en ningún elemento
```

---

## Iconografía
- Usar **Lucide React** exclusivamente
- `strokeWidth={1.5}` siempre — nunca el default de 2 (se ve muy pesado)
- Tamaño estándar: 16px para UI, 20px para acciones, 24px para navegación

---

## Animaciones
- Minimalistas y funcionales — nada decorativo
- Transiciones: `transition: all 150ms ease` para hovers
- Aparición de modales: `opacity 0→1` + `translateY 4px→0`, 200ms
- Sin animaciones de página completa ni loaders elaborados
- Loading states: skeleton con `background: linear-gradient(90deg, #F0EDE8, #E8E4DE, #F0EDE8)`

---

## Layout del dashboard

```
┌──────────┬─────────────────────────────────────────┐
│          │  Header: breadcrumb + acciones           │
│ Sidebar  ├─────────────────────────────────────────┤
│ 240px    │                                         │
│ negro    │  Contenido de página                    │
│          │  padding: 32px                          │
│          │                                         │
└──────────┴─────────────────────────────────────────┘
```

- Sidebar fijo, 240px
- Header de página: 64px, border-bottom 1px
- Contenido: max-width 1280px centrado si la pantalla es muy ancha

---

## Lo que nunca hacer
- ❌ Border-radius mayor a 6px en componentes de UI
- ❌ Sombras con blur (box-shadow difuso)
- ❌ Colores saturados o brillantes
- ❌ Gradientes en botones o backgrounds
- ❌ Fuentes genéricas (Inter, Roboto, Arial)
- ❌ Iconos con strokeWidth > 1.5
- ❌ Animaciones de más de 300ms
- ❌ Cards con mucho padding — mantener densidad de información
- ❌ Backgrounds blancos puros en la página — siempre el hueso #F8F7F4

---

## Referencia visual
Inspiración: Arquitectura Bauhaus, dashboards de Bloomberg Terminal modernizados, catálogos de diseño escandinavo, interfaces de herramientas CAD contemporáneas.
Productos similares en estética: Linear, Vercel Dashboard, Arc Browser.