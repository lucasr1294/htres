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
**Propósito**: Morning briefing — en 30 segundos sabés si hay algo urgente.
- 4 KPIs: valor del inventario, ventas del mes, órdenes activas, pagos pendientes
- Alertas de stock bajo con acceso rápido a reponer
- Órdenes en camino con estado y fecha estimada
- Actividad reciente (últimas ventas)
- Resumen financiero del mes (importado vs vendido)
- Skill: `skills/dashboard.md`

### Catálogo de Productos
**Propósito**: Definir qué productos existen — separado del stock.
- Vista tabla y vista grilla (cards con fotos)
- Ficha de producto: info, precios, variantes, fotos, historial de importaciones
- Cálculo de margen por producto con semáforo visual
- Convención de SKUs: CAT-000 o CAT-000-VAR
- Preparado para futura sincronización con Tienda Nube
- Skill: `skills/catalogo.md`

### Stock
**Propósito**: Inventario físico en tiempo real.
- Tabla con disponible / reservado / en tránsito por producto
- Alertas visuales cuando stock ≤ umbral
- Historial de movimientos por producto
- Registro manual de entradas/salidas
- Exportar a Excel
- Skill: `skills/stock.md`

### Órdenes de Importación
**Propósito**: Reemplazar el caos de WhatsApp con proveedores.
- Pipeline de órdenes con estados visuales
- Crear orden: proveedor + productos + cantidades + costo USD
- Timeline de cada orden (pedido → producción → tránsito → aduana → recibida)
- Tracking number y documentos adjuntos
- Al marcar RECIBIDA → stock se actualiza automáticamente
- Sección de pagos por orden (anticipo + saldo)
- Skills: `skills/importacion.md` + `skills/pagos.md`

### Proveedores
**Propósito**: Rolodex inteligente de contactos en China.
- Lista con nombre, ciudad, plataforma, rating
- Ficha: contacto, tiempos promedio, historial de órdenes, productos comprados
- Rating editable con notas internas
- Acceso rápido: "Nueva orden a este proveedor"
- Skill: `skills/proveedor.md`

### Reportes
**Propósito**: Números reales para reuniones con socios y decisiones de negocio.
- Ventas por canal (Instagram / Tienda Nube)
- Rotación de productos (qué se vende rápido, qué acumula)
- Margen bruto por producto
- Stock valorizado
- Pagos a proveedores del período
- Exportar a Excel o PDF
- Skill: `skills/reportes.md`

### Configuración
- Gestión de usuarios y roles
- Tipo de cambio USD/ARS (actualización manual)
- Categorías de productos

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
