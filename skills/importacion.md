# SKILL: Órdenes de Importación

## Objetivo
Este skill define cómo trabajar con el módulo de importaciones. Usarlo antes de construir o modificar cualquier funcionalidad relacionada con órdenes a proveedores.

---

## Flujo de vida de una orden

```
BORRADOR → CONFIRMADA → EN_PRODUCCION → EN_TRANSITO → EN_ADUANA → RECIBIDA
                                                                  ↘ CANCELADA (desde cualquier estado antes de RECIBIDA)
```

### Estados y qué significa cada uno

| Estado         | Significado                                                  |
|----------------|--------------------------------------------------------------|
| BORRADOR       | Orden creada pero no enviada al proveedor todavía            |
| CONFIRMADA     | Proveedor confirmó y recibió el pago/anticipo                |
| EN_PRODUCCION  | Proveedor está fabricando/preparando la mercadería           |
| EN_TRANSITO    | Mercadería embarcada, en camino                              |
| EN_ADUANA      | Mercadería llegó al país, en proceso de despacho             |
| RECIBIDA       | Mercadería en depósito — trigger de actualización de stock   |
| CANCELADA      | Orden cancelada — no afecta stock                            |

**Importante**: Solo la transición a `RECIBIDA` dispara actualización de stock.

---

## Cálculo de costos

El costo real de una importación incluye:
1. **Precio FOB** (precio del proveedor en USD)
2. **Flete internacional** (estimado o real)
3. **Aranceles y tasas** (~50% del valor FOB en Argentina, puede variar)
4. **Gastos de despacho local** (despachante, transporte interno)

### Costo estimado por unidad
```
costoUnitario = (precioFOB + flete) × (1 + tasaAranceles) / cantidadUnidades
```

El sistema guarda el `costoTotalUSD` de la orden. El precio de costo por producto se actualiza al recibir la orden si el costo real difiere del estimado.

---

## Reglas de negocio

1. Una orden en estado BORRADOR puede modificarse libremente
2. Una vez CONFIRMADA, solo se puede actualizar el estado, tracking y notas
3. Solo un Admin puede confirmar una orden (cambiar de BORRADOR → CONFIRMADA)
4. Al pasar a RECIBIDA, el sistema automáticamente:
   - Llama a `recibirOrden()` del skill de stock
   - Actualiza `enTransito` en stock (resta las cantidades)
   - Registra movimientos tipo ENTRADA para cada producto
5. Una orden CANCELADA no puede reactivarse — crear una nueva
6. El número de tracking es opcional hasta EN_TRANSITO, requerido después

---

## Formulario de nueva orden

Campos requeridos:
- Proveedor (select)
- Fecha de pedido
- Productos y cantidades (tabla dinámica: agregar/quitar filas)
- Costo total USD

Campos opcionales:
- Fecha estimada de llegada
- Número de tracking
- Notas
- Documentos adjuntos (invoice, packing list)

---

## UI: Lista de órdenes

La tabla debe mostrar:
- ID de orden, Proveedor
- Productos (cantidad de items)
- Costo total USD
- Estado (con badge de color)
- Fecha pedido / Fecha estimada
- Tracking (si existe)

Colores de estado sugeridos:
- BORRADOR: gris
- CONFIRMADA: azul
- EN_PRODUCCION: amarillo
- EN_TRANSITO: naranja
- EN_ADUANA: naranja oscuro
- RECIBIDA: verde
- CANCELADA: rojo

### Vista detalle de una orden
- Todos los campos de la orden
- Tabla de items (producto, cantidad, precio unitario estimado)
- Timeline de cambios de estado
- Botón para avanzar al siguiente estado
- Botón para cancelar (con confirmación)

---

## Notas sobre proveedores chinos

- La mayoría opera en **Alibaba** o **1688** (mercado interno chino, más barato)
- Los tiempos de producción varían: productos standard 7-15 días, custom 30-60 días
- El flete más común es marítimo (30-45 días) o aéreo (5-10 días, mucho más caro)
- Siempre pedir **packing list** antes del embarque para registrar los items exactos
- Guardar el número de **BL (Bill of Lading)** como tracking en envíos marítimos
