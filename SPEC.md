# SPEC.md — Especificación Funcional

## Objetivo del sistema
Plataforma interna para gestionar el ciclo completo de un negocio de importación de decoración del hogar: desde la orden a proveedores chinos hasta la venta al cliente final, con visibilidad de stock y métricas para los socios.

---

## Entidades del negocio

### Producto
Artículo de decoración importado.
- Nombre, descripción, SKU único
- Categoría (ej: textiles, iluminación, muebles, accesorios)
- Variantes: color, tamaño, material
- Precio de costo (en USD, incluye flete estimado)
- Precio de venta (en ARS)
- Fotos
- Estado: activo / descontinuado

### Stock
Inventario actual por producto.
- Cantidad disponible
- Cantidad reservada (en órdenes pendientes)
- Cantidad en tránsito (importaciones en curso)
- Umbral de reposición (alerta cuando el stock baja de X unidades)
- Ubicación física (ej: depósito, local)

### Proveedor
Empresa o persona en China que provee los productos.
- Nombre, país, ciudad
- Contacto (email, WhatsApp, plataforma: Alibaba / 1688 / directo)
- Tiempo de producción promedio (días)
- Tiempo de envío promedio (días)
- Historial de órdenes
- Rating interno (1-5)

### Orden de Importación
Compra realizada a un proveedor.
- Proveedor asociado
- Lista de productos y cantidades
- Costo total en USD (productos + flete + aranceles estimados)
- Fecha de pedido
- Fecha estimada de llegada
- Estado: borrador / confirmada / en producción / en tránsito / en aduana / recibida / cancelada
- Número de tracking
- Documentos adjuntos (factura, packing list, etc.)
- Notas

### Venta
Venta realizada a un cliente.
- Productos vendidos y cantidades
- Canal de venta (ej: local, Instagram, MercadoLibre, mayorista)
- Precio total en ARS
- Fecha
- Notas

---

## Módulos de la app

### Dashboard (página principal)
- Resumen: stock total, valor del inventario, ventas del mes, órdenes activas
- Alertas de stock bajo
- Órdenes de importación en curso con estado
- Últimas ventas

### Stock
- Tabla de productos con stock actual
- Filtros por categoría, estado, nivel de stock
- Vista de un producto: detalle completo + historial de movimientos
- Registro manual de entrada/salida de stock
- Exportar a Excel

### Importaciones
- Lista de órdenes con estado y tracking
- Crear nueva orden (seleccionar proveedor + productos + cantidades)
- Actualizar estado de una orden
- Al marcar como "recibida": actualizar stock automáticamente

### Proveedores
- Lista de proveedores con rating y últimas órdenes
- Ficha de proveedor con historial completo
- Crear / editar proveedor

### Reportes
- Rotación de productos (qué se vende más)
- Costo promedio de importación por categoría
- Margen bruto por producto
- Stock valorizado
- Exportar a PDF o Excel

### Configuración
- Gestión de usuarios y roles
- Categorías de productos
- Tipos de cambio (USD/ARS) actualizables manualmente

---

## Roles y permisos

| Acción                     | Admin | Socio |
|----------------------------|-------|-------|
| Ver dashboard              | ✅    | ✅    |
| Ver stock                  | ✅    | ✅    |
| Modificar stock            | ✅    | ✅    |
| Crear orden de importación | ✅    | ✅    |
| Aprobar orden              | ✅    | ❌    |
| Ver reportes               | ✅    | ✅    |
| Gestionar usuarios         | ✅    | ❌    |
| Editar configuración       | ✅    | ❌    |

---

## Flujos principales

### Alta de nuevo producto importado
1. Crear ficha de producto con SKU y precios
2. Crear orden de importación al proveedor
3. Cuando llega: marcar orden como "recibida" → stock se actualiza solo
4. Producto disponible para venta

### Reposición de stock
1. Sistema genera alerta cuando stock < umbral
2. Admin crea nueva orden al proveedor
3. Se registra como "en tránsito" con fecha estimada
4. Al recibir: stock actualizado automáticamente

---

## Notas de implementación
- El tipo de cambio USD/ARS se actualiza manualmente (no automático)
- Los costos de importación incluyen: producto + flete + aranceles estimados (~50% del valor FOB en Argentina)
- El sistema es interno, no hay portal para clientes
