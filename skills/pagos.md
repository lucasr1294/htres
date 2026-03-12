# SKILL: Pagos a Proveedores

## Objetivo
Registrar y hacer seguimiento de los pagos asociados a cada orden de importación. El módulo de pagos vive dentro del módulo de Órdenes — no es una sección separada en la navegación, pero tiene su propia lógica y UI.

---

## Contexto del negocio

Las importaciones desde China generalmente tienen esta estructura de pago:

```
Orden confirmada
    ↓
Anticipo (30-50% del total) → proveedor empieza a producir
    ↓
Saldo (50-70% restante) → antes del embarque o al recibir documentos
    ↓
Orden embarcada
```

Algunos proveedores pueden pedir el 100% por adelantado o tener otras condiciones. El sistema debe ser flexible.

---

## Entidad Pago

| Campo | Tipo | Descripción |
|-------|------|-------------|
| ordenId | Relación | Orden de importación asociada |
| tipo | Enum | ANTICIPO / SALDO / TOTAL / OTRO |
| montoUSD | Decimal | Monto pagado en USD |
| fecha | DateTime | Fecha en que se realizó el pago |
| metodoPago | String | Wire transfer, Western Union, Wise, etc. |
| comprobante | String | URL del comprobante (imagen o PDF) |
| notas | String | Observaciones |

---

## Lógica de pagos por orden

```typescript
// Para cada orden:
const totalOrden = orden.costoTotalUSD
const totalPagado = sum(orden.pagos.map(p => p.montoUSD))
const saldoPendiente = totalOrden - totalPagado
const porcentajePagado = (totalPagado / totalOrden) * 100

// Estado de pago (distinto al estado de la orden)
// PENDIENTE:   totalPagado === 0
// PARCIAL:     totalPagado > 0 && totalPagado < totalOrden
// COMPLETO:    totalPagado >= totalOrden
```

---

## UI dentro de la ficha de orden

En la vista detalle de una orden, agregar una sección "Pagos":

```
┌─────────────────────────────────────────────┐
│ PAGOS                                        │
│                                              │
│ Total orden:      $3,200 USD                 │
│ Total pagado:     $960 USD (30%)             │
│ Saldo pendiente:  $2,240 USD                 │
│                                              │
│ [████░░░░░░░░░░░░░░░░] 30%                   │
│                                              │
│ 15/03/2026  Anticipo  $960  Wire Transfer    │
│             [ver comprobante]                │
│                                              │
│ + Registrar pago                             │
└─────────────────────────────────────────────┘
```

- Barra de progreso de pago: estilo minimalista, sin colores brillantes
- Cada pago listado con fecha, tipo, monto y link al comprobante
- Botón "Registrar pago" abre un modal simple

---

## En el Dashboard

El KPI "Pagos pendientes" del dashboard se calcula así:
```typescript
// Suma de saldos pendientes de órdenes activas (no CANCELADA, no BORRADOR)
const pagosPendientes = ordenes
  .filter(o => !['CANCELADA', 'BORRADOR', 'RECIBIDA'].includes(o.estado))
  .reduce((sum, o) => sum + o.saldoPendiente, 0)
```

---

## Reglas de negocio

1. Se puede registrar más de un pago por orden
2. El total de pagos puede superar el costo estimado de la orden (si el costo real fue mayor)
3. Registrar un pago no cambia el estado de la orden — son independientes
4. Un comprobante de pago es opcional pero recomendado — el sistema lo solicita pero no lo bloquea
5. Los pagos no se pueden eliminar, solo anular (con nota de motivo) para mantener trazabilidad

---

## Reportes relacionados

En el módulo de Reportes, incluir:
- **Pagos del mes**: suma de pagos realizados en el período seleccionado
- **Pagos pendientes por proveedor**: cuánto le debés a cada uno
- **Flujo de pagos**: timeline de pagos realizados y estimados próximos
