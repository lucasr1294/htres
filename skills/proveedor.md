# SKILL: Gestión de Proveedores

## Objetivo
Este skill define cómo trabajar con el módulo de proveedores. Usarlo antes de construir o modificar cualquier funcionalidad relacionada con proveedores.

---

## Entidad Proveedor

Un proveedor es una empresa o persona en China (u otro origen) que suministra productos.

### Campos clave

| Campo             | Tipo    | Descripción                                      |
|-------------------|---------|--------------------------------------------------|
| nombre            | String  | Nombre del proveedor o empresa                   |
| ciudad            | String  | Ciudad en China (ej: Yiwu, Guangzhou, Shenzhen)  |
| contacto          | String  | Email, WhatsApp o WeChat                         |
| plataforma        | Enum    | Alibaba / 1688 / AliExpress / Directo            |
| urlPerfil         | String  | Link al perfil de Alibaba/1688                   |
| tiempoProduccion  | Int     | Días promedio de producción                      |
| tiempoEnvio       | Int     | Días promedio de envío hasta Argentina           |
| rating            | Int     | 1 a 5 — evaluación interna                       |
| notas             | String  | Observaciones libres                             |

---

## Rating interno

El rating (1-5) es una evaluación subjetiva basada en:
- **Calidad del producto** (¿coincide con las muestras?)
- **Cumplimiento de tiempos** (¿entrega en la fecha acordada?)
- **Comunicación** (¿responde rápido y claramente?)
- **Precio** (¿es competitivo?)

Mostrar el rating como estrellas en la UI.

---

## Ficha de proveedor

La vista detalle de un proveedor debe incluir:

1. **Info de contacto** — nombre, plataforma, link, contacto directo
2. **Métricas calculadas**:
   - Total de órdenes realizadas
   - Valor total importado (USD)
   - Tiempo promedio real de entrega (calculado de órdenes históricas)
   - Último pedido (fecha)
3. **Rating** con posibilidad de editar
4. **Historial de órdenes** — tabla con las últimas órdenes a este proveedor
5. **Productos asociados** — qué productos se importaron de este proveedor
6. **Notas** — campo de texto libre para observaciones

---

## Reglas de negocio

1. No se puede eliminar un proveedor que tenga órdenes asociadas — solo desactivar
2. Un proveedor desactivado no aparece en el selector de nuevas órdenes
3. El rating se actualiza manualmente, no es automático
4. Los campos mínimos para crear un proveedor son: nombre y al menos un método de contacto

---

## UI: Lista de proveedores

Tabla con:
- Nombre, Ciudad, Plataforma
- Rating (estrellas)
- Cantidad de órdenes
- Último pedido
- Estado (activo/inactivo)

Acciones:
- Ver ficha completa
- Crear nueva orden a este proveedor (shortcut)
- Activar/desactivar

---

## Ciudades clave de China para decoración

- **Yiwu** — mercado masivo, todo tipo de accesorios y decoración pequeña
- **Guangzhou** — muebles, textiles, iluminación
- **Foshan** — muebles y decoración de hogar premium
- **Shenzhen** — electrónica, iluminación LED, productos tech
- **Hangzhou** — textiles, ropa de hogar

Este contexto es útil para ordenar y filtrar proveedores por especialidad.
