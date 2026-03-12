# SKILL: Catálogo de Productos

## Objetivo
El catálogo es donde se definen los productos del negocio — sus características, fotos, precios y categorías. Es independiente del stock: el catálogo dice "qué existe", el stock dice "cuántos hay". Leer también `skills/stock.md` cuando se trabaje en la relación entre ambos.

---

## Separación catálogo / stock

```
Catálogo → define el producto (qué es, cómo se ve, cuánto cuesta)
Stock    → registra la cantidad (cuántos hay, dónde están)
```

Un producto puede existir en el catálogo con stock 0 — eso significa que está agotado pero sigue activo en el negocio.

---

## Entidad Producto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| sku | String único | Código interno. Formato sugerido: CAT-000 (ej: ILU-001, TEX-042) |
| nombre | String | Nombre comercial del producto |
| descripcion | String | Descripción para uso interno y futuro catálogo online |
| categoria | Enum | Ver categorías abajo |
| subcategoria | String | Libre, para mayor granularidad |
| variantes | Array | Color, material, tamaño — ver sección variantes |
| precioUSD | Decimal | Costo CIF estimado (producto + flete + aranceles) |
| precioARS | Decimal | Precio de venta al público |
| precioMayorista | Decimal | Precio para revendedores (opcional) |
| proveedor | Relación | Proveedor principal de este producto |
| fotos | Array | URLs de imágenes |
| activo | Boolean | Si está disponible para venta |
| destacado | Boolean | Para mostrar en dashboard o futuro catálogo online |
| notas | String | Observaciones internas |

---

## Categorías

```typescript
enum Categoria {
  ILUMINACION     // Lámparas, apliques, tiras LED
  TEXTILES        // Almohadones, mantas, cortinas
  DECORACION      // Esculturas, cuadros, espejos, velas
  ORGANIZACION    // Cajas, cestos, soportes
  MUEBLES         // Mesas auxiliares, estantes, sillas
  EXTERIOR        // Macetas, objetos para jardín/terraza
  OTROS
}
```

---

## Variantes

Algunos productos tienen variantes (mismo producto, diferente color o tamaño). Cada variante puede tener:
- Nombre (ej: "Natural", "Negro mate", "40cm")
- Diferencia de precio respecto al base (positiva o negativa)
- SKU propio (ej: ILU-001-NEG, ILU-001-NAT)
- Stock propio

Si un producto no tiene variantes, no mostrar la sección de variantes en la UI.

---

## Cálculo de margen

```typescript
// Margen bruto estimado
const precioUSDEquivalente = precioARS / tipoCambio
const margen = ((precioUSDEquivalente - precioUSD) / precioUSD) * 100

// Semáforo de margen (colores apagados, nunca brillantes)
// > 80%  → verde oscuro (#3D5A3E)
// 50-80% → neutro (sin color especial)
// < 50%  → ámbar oscuro (#7A5C2E)
// < 30%  → rojo oscuro (#5C2E2E)
```

---

## UI: Lista de productos

Dos vistas disponibles (toggle):

**Vista tabla** (default):
- SKU, Nombre, Categoría, Proveedor, Costo USD, Precio ARS, Margen %, Stock actual, Estado
- Ordenable por cualquier columna
- Filtros: categoría, proveedor, activo/inactivo, con/sin stock

**Vista grilla** (cards):
- Foto principal, nombre, precio ARS, stock actual, badge de categoría
- Útil para presentar a socios o revisar visualmente el catálogo
- 3 columnas desktop, 2 tablet, 1 mobile

---

## UI: Ficha de producto

Secciones:
1. **Info principal** — nombre, SKU, descripción, categoría, proveedor
2. **Precios** — costo USD, precio ARS, margen calculado, precio mayorista
3. **Variantes** — tabla editable de variantes si aplica
4. **Fotos** — grilla de imágenes, drag to reorder, primera = foto principal
5. **Stock actual** — widget que muestra disponible/reservado/en tránsito con link al módulo de stock
6. **Historial** — de qué órdenes de importación vino este producto y a qué costo

---

## SKU — Convención

```
[CATEGORIA 3 letras]-[número 3 dígitos]-[variante 3 letras opcional]

Ejemplos:
ILU-001          → lámpara sin variantes
ILU-001-NEG      → lámpara, variante negra
TEX-042-GRI      → textil, variante gris
DEC-015          → decoración sin variantes
```

El sistema debe validar unicidad del SKU al crear o editar.

---

## Integración futura con Tienda Nube

El catálogo está diseñado pensando en una futura sincronización con Tienda Nube:
- El campo `descripcion` se usará como descripción del producto en la tienda
- Las `fotos` serán las imágenes del producto en la tienda
- El `precioARS` será el precio público
- El campo `activo` controlará si el producto está visible en la tienda

No implementar la sincronización ahora, pero no tomar decisiones de estructura que la dificulten.
