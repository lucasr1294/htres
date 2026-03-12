# SKILL: Gestión de Stock

## Objetivo
Este skill define cómo trabajar con el módulo de stock del sistema. Usarlo antes de construir o modificar cualquier funcionalidad relacionada con inventario.

---

## Conceptos clave

### Tipos de stock
- **Disponible**: unidades físicamente en depósito, listas para vender
- **Reservado**: unidades comprometidas en órdenes de venta pendientes (no disponibles)
- **En tránsito**: unidades en una orden de importación confirmada, aún no recibidas

### Stock real vs stock visible
- Stock visible para venta = `disponible - reservado`
- Nunca mostrar el stock en tránsito como disponible hasta que la orden se marque como RECIBIDA

### Umbral de alerta
- Cada producto tiene un `umbralAlerta`
- Cuando `disponible <= umbralAlerta`, generar alerta visible en el dashboard
- El umbral default es 5 unidades

---

## Movimientos de stock

Cada cambio de stock debe registrarse en `MovimientoStock` con:
- `tipo`: ENTRADA | SALIDA | AJUSTE | RESERVA | LIBERACION
- `cantidad`: número positivo siempre (el tipo indica la dirección)
- `motivo`: texto descriptivo (ej: "Recepción orden #123", "Venta canal Instagram")
- `usuarioId`: quién hizo el movimiento
- `fecha`: timestamp automático

### Tipos de movimiento

| Tipo        | Cuándo usarlo                                      | Afecta campo    |
|-------------|-----------------------------------------------------|-----------------|
| ENTRADA     | Llega mercadería (orden recibida, ajuste positivo)  | disponible +    |
| SALIDA      | Venta confirmada, pérdida, ajuste negativo          | disponible -    |
| RESERVA     | Orden de venta creada                               | reservado +     |
| LIBERACION  | Orden de venta cancelada                            | reservado -     |
| AJUSTE      | Corrección manual (inventario físico)               | disponible =    |

---

## Reglas de negocio

1. **Nunca** reducir `disponible` por debajo de 0 — validar antes de cualquier SALIDA
2. **Nunca** reducir `reservado` por debajo de 0
3. Toda modificación de stock debe pasar por la función `registrarMovimiento()` en `/lib/stock.ts`, nunca actualizar directamente con Prisma
4. Al recibir una orden de importación (estado → RECIBIDA):
   - Sumar las cantidades de cada item a `disponible`
   - Restar de `enTransito`
   - Registrar movimiento tipo ENTRADA por cada producto
5. Los ajustes manuales requieren un motivo obligatorio

---

## Funciones principales a implementar

```typescript
// lib/stock.ts

// Registrar cualquier movimiento de stock
registrarMovimiento(productoId, tipo, cantidad, motivo, usuarioId)

// Obtener stock actual de un producto
getStock(productoId): Promise<Stock>

// Obtener productos con stock bajo
getStockBajo(): Promise<Producto[]>

// Procesar recepción de una orden completa
recibirOrden(ordenId, usuarioId): Promise<void>

// Obtener historial de movimientos de un producto
getHistorialMovimientos(productoId, filtros): Promise<MovimientoStock[]>
```

---

## UI: Tabla de stock

La tabla principal de stock debe mostrar:
- SKU, Nombre, Categoría
- Disponible, Reservado, En tránsito
- Umbral de alerta (con indicador visual si está en alerta)
- Última actualización

Filtros requeridos:
- Por categoría
- Por estado de alerta (todos / solo con alerta)
- Búsqueda por nombre o SKU

Acciones por fila:
- Ver historial de movimientos
- Registrar entrada/salida manual
- Editar umbral de alerta

---

## Exportación
- La tabla de stock debe poder exportarse a Excel (`.xlsx`)
- Columnas: SKU, Nombre, Categoría, Disponible, Reservado, En tránsito, Precio USD, Precio ARS, Valor total (disponible × precio USD)
- Usar SheetJS para la exportación
