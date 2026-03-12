# SKILL: Reportes y Métricas

## Objetivo
Este skill define cómo construir el módulo de reportes y qué métricas son relevantes para el negocio. Usarlo antes de implementar cualquier dashboard, gráfico o exportación.

---

## Métricas del dashboard principal

### KPIs de resumen (cards superiores)
1. **Valor del inventario** — stock disponible × precio costo USD (convertido a ARS)
2. **Ventas del mes** — suma de ventas en ARS del mes en curso
3. **Órdenes activas** — órdenes que NO están en RECIBIDA, CANCELADA ni BORRADOR
4. **Alertas de stock** — cantidad de productos por debajo del umbral

### Widgets secundarios
- **Órdenes en curso**: lista de órdenes activas con estado y fecha estimada
- **Stock bajo**: productos con stock ≤ umbral (nombre, disponible, umbral)
- **Últimas ventas**: 5 ventas más recientes

---

## Reportes disponibles

### 1. Reporte de Stock
**Datos**: todos los productos con su stock actual
**Columnas**: SKU, Nombre, Categoría, Disponible, Reservado, En tránsito, Precio costo USD, Precio venta ARS, Margen bruto estimado (%)
**Filtros**: por categoría, por estado de alerta
**Exportación**: Excel (.xlsx)

### 2. Rotación de Productos
**Datos**: qué productos se vendieron más en un período
**Columnas**: Producto, Unidades vendidas, Ingresos ARS, % del total
**Filtros**: rango de fechas, categoría
**Gráfico**: barras horizontales (top 10)

### 3. Costos de Importación
**Datos**: costo promedio de importación por categoría y proveedor
**Columnas**: Proveedor/Categoría, Total USD importado, Cantidad órdenes, Costo promedio por orden
**Gráfico**: dona o barras por categoría

### 4. Margen Bruto por Producto
**Datos**: diferencia entre precio de venta y costo de importación
**Fórmula**: `margen = (precioVentaARS / tipoCambio - costoCifUSD) / costoCifUSD × 100`
**Columnas**: Producto, Costo USD, Precio venta ARS, Precio venta USD equivalente, Margen %
**Semáforo**: verde (>60%), amarillo (30-60%), rojo (<30%)

### 5. Stock Valorizado
**Datos**: valor total del inventario
**Desglosa por**: categoría, proveedor
**Total**: suma del inventario valorizado en USD y ARS

---

## Tipo de cambio

- El tipo de cambio USD/ARS se guarda en la tabla `Configuracion` con clave `tipo_cambio_usd`
- Se actualiza manualmente desde la página de Configuración
- Todos los reportes que mezclan ARS y USD usan este valor
- Mostrar siempre la fecha de última actualización del tipo de cambio en los reportes

---

## Librerías para gráficos

Usar **Recharts** para todos los gráficos:

```typescript
// Gráfico de barras — rotación de productos
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Gráfico de dona — distribución por categoría
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

// Gráfico de línea — ventas en el tiempo
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
```

Paleta de colores a usar en gráficos:
```
['#4F7942', '#7BAF6E', '#A8CC9C', '#D4EAD0', '#2D5A27']
```

---

## Exportación a Excel

Usar **SheetJS** para todas las exportaciones:

```typescript
import * as XLSX from 'xlsx'

function exportarExcel(datos: any[], nombreArchivo: string) {
  const ws = XLSX.utils.json_to_sheet(datos)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
  XLSX.writeFile(wb, `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.xlsx`)
}
```

---

## Exportación a PDF

Para reportes en PDF usar la librería `@react-pdf/renderer` o simplemente `window.print()` con estilos de impresión. El método más simple es un botón "Imprimir" que abre el diálogo del browser con la página formateada para impresión.

---

## Filtros estándar para reportes

Todos los reportes con rango de fechas deben ofrecer:
- Hoy
- Esta semana
- Este mes (default)
- Este año
- Rango personalizado (date picker)

---

## Performance

- Los reportes pesados deben calcularse en el servidor (Server Components o API routes), no en el cliente
- Para dashboards en tiempo real, usar `revalidate` de Next.js cada 60 segundos
- No cargar todos los movimientos de stock para calcular métricas — usar agregaciones en la query de Prisma
