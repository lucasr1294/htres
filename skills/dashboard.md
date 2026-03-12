# SKILL: Dashboard

## Objetivo
El dashboard es la pantalla principal de la app. Debe funcionar como un "morning briefing" — el usuario entra y en 30 segundos sabe si hay algo urgente que atender. No es un reporte detallado, es una vista ejecutiva del estado del negocio.

---

## KPIs principales (cards superiores)

Mostrar 4 cards en la parte superior, en este orden de prioridad:

| Card | Dato | Cálculo |
|------|------|---------|
| Valor del inventario | Stock disponible × costo USD × tipo de cambio | Solo productos activos |
| Ventas del mes | Suma de ventas en ARS del mes en curso | Comparar vs mes anterior (% variación) |
| Órdenes activas | Count de órdenes que no son RECIBIDA, CANCELADA ni BORRADOR | — |
| Pagos pendientes | Suma de saldos pendientes en órdenes confirmadas en USD | Anticipo pagado, saldo no pagado aún |

La primera card usa `--color-surface-alt` (mármol) y borde izquierdo de acento. Las demás usan `--color-surface`.

---

## Sección: Alertas de stock bajo

- Listado de productos con `disponible <= umbralAlerta`
- Mostrar: nombre del producto, stock actual, umbral, botón "Reponer" (crea orden)
- Si no hay alertas: mostrar estado vacío positivo ("Todo el stock está en orden")
- Máximo 5 items visibles — link "Ver todos" lleva al módulo de Stock filtrado

---

## Sección: Órdenes en camino

- Lista de órdenes en estado EN_PRODUCCION, EN_TRANSITO o EN_ADUANA
- Mostrar por orden: proveedor, productos (cantidad de items), estado con badge, fecha estimada de llegada
- Ordenar por fecha estimada ascendente (la más próxima primero)
- Si hay tracking, mostrarlo como texto copiable
- Máximo 5 items — link "Ver todas" lleva al módulo de Órdenes

---

## Sección: Actividad reciente

- Últimas 5 ventas registradas
- Mostrar: fecha, canal (Instagram / Tienda Nube), productos vendidos, total ARS
- Diseño compacto tipo feed, sin tabla completa

---

## Sección: Resumen financiero del mes

- Dos columnas simples:
  - **Importado**: suma de costos USD de órdenes CONFIRMADAS o más en el mes
  - **Vendido**: suma de ventas ARS del mes
- No es un reporte detallado — solo los números del mes en curso
- Incluir tipo de cambio usado y fecha de última actualización

---

## Comportamiento

- Los datos se refrescan cada 60 segundos automáticamente (`revalidate: 60` en Next.js)
- En mobile: las 4 cards van en columna, las secciones se apilan verticalmente
- Los números de dinero siempre con separador de miles y 2 decimales
- Los porcentajes de variación: verde oscuro si positivo, rojo oscuro si negativo (nunca colores brillantes)

---

## Estado vacío (primera vez)

Si no hay datos aún (negocio nuevo), mostrar un onboarding suave:
1. "Agregá tu primer proveedor"
2. "Cargá tus productos"
3. "Creá tu primera orden"

Como steps visuales, no como alerts molestos.
