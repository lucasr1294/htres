# STACK.md — Decisiones Tecnológicas

## Stack principal

| Capa          | Tecnología          | Versión  | Motivo                                          |
|---------------|---------------------|----------|-------------------------------------------------|
| Framework     | Next.js (App Router)| 14+      | Full-stack en un repo, SSR, API routes nativas  |
| Lenguaje      | TypeScript          | 5+       | Tipado, menos bugs, mejor experiencia con Claude|
| Estilos       | Tailwind CSS        | 3+       | Utilidades rápidas, responsive out of the box   |
| ORM           | Prisma              | 5+       | Schema declarativo, migraciones, type-safety    |
| Base de datos | PostgreSQL          | 15+      | Relacional, robusto, gratis con Supabase        |
| Auth          | Supabase Auth       | —        | Usuarios, sesiones y roles sin construir nada   |
| Deploy        | Vercel              | —        | CI/CD automático desde GitHub                   |
| DB Cloud      | Supabase            | —        | PostgreSQL hosted + Auth + dashboard visual     |
| DB Local      | Docker + PostgreSQL | —        | Mismo entorno local que en producción           |

---

## Librerías UI

| Librería        | Uso                                        |
|-----------------|--------------------------------------------|
| shadcn/ui       | Componentes base (tablas, modales, forms)  |
| Recharts        | Gráficos del dashboard y reportes          |
| TanStack Table  | Tablas con filtros, sort y paginación      |
| React Hook Form | Formularios con validación                 |
| Zod             | Validación de schemas (frontend + backend) |
| date-fns        | Manejo de fechas                           |
| xlsx (SheetJS)  | Exportar reportes a Excel                  |

---

## Estructura de carpetas

```
/
├── app/
│   ├── (auth)/              ← páginas de login
│   ├── (dashboard)/         ← páginas protegidas
│   │   ├── page.tsx         ← dashboard principal
│   │   ├── stock/
│   │   ├── ordenes/
│   │   ├── proveedores/
│   │   └── reportes/
│   └── api/
│       ├── stock/
│       ├── ordenes/
│       ├── proveedores/
│       └── ventas/
├── components/
│   ├── ui/                  ← componentes de shadcn/ui
│   ├── stock/
│   ├── ordenes/
│   └── shared/              ← componentes reutilizables
├── lib/
│   ├── prisma.ts            ← cliente Prisma singleton
│   ├── supabase.ts          ← cliente Supabase
│   └── utils.ts             ← helpers generales
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── skills/                  ← skills de agentes Claude
├── public/
├── CLAUDE.md
├── SPEC.md
└── STACK.md
```

---

## Base de datos — Modelos principales (Prisma)

```prisma
model Producto {
  id          String   @id @default(cuid())
  sku         String   @unique
  nombre      String
  descripcion String?
  categoria   String
  precioUSD   Decimal
  precioARS   Decimal
  activo      Boolean  @default(true)
  creadoEn    DateTime @default(now())

  stock       Stock?
  variantes   Variante[]
  itemsOrden  ItemOrden[]
}

model Stock {
  id             String   @id @default(cuid())
  productoId     String   @unique
  disponible     Int      @default(0)
  reservado      Int      @default(0)
  enTransito     Int      @default(0)
  umbralAlerta   Int      @default(5)
  ubicacion      String?
  actualizadoEn  DateTime @updatedAt

  producto       Producto @relation(fields: [productoId], references: [id])
  movimientos    MovimientoStock[]
}

model Proveedor {
  id              String   @id @default(cuid())
  nombre          String
  ciudad          String?
  contacto        String?
  plataforma      String?  // Alibaba, 1688, directo
  tiempoProduccion Int?    // días
  tiempoEnvio     Int?    // días
  rating          Int?    // 1-5
  creadoEn        DateTime @default(now())

  ordenes         OrdenImportacion[]
}

model OrdenImportacion {
  id              String   @id @default(cuid())
  proveedorId     String
  costoTotalUSD   Decimal
  estado          EstadoOrden @default(BORRADOR)
  fechaPedido     DateTime
  fechaEstimada   DateTime?
  tracking        String?
  notas           String?
  creadoEn        DateTime @default(now())

  proveedor       Proveedor @relation(fields: [proveedorId], references: [id])
  items           ItemOrden[]
}

enum EstadoOrden {
  BORRADOR
  CONFIRMADA
  EN_PRODUCCION
  EN_TRANSITO
  EN_ADUANA
  RECIBIDA
  CANCELADA
}
```

---

## Entornos

### Local
```bash
# Levantar DB local
docker compose up -d

# Variables de entorno: .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deco_db"
```

### Producción (Supabase + Vercel)
```bash
# Variables en Vercel Dashboard
DATABASE_URL=               # connection string de Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Comandos frecuentes

```bash
# Desarrollo
npm run dev

# Crear migración de DB
npx prisma migrate dev --name descripcion-del-cambio

# Ver DB en browser
npx prisma studio

# Build para producción
npm run build

# Levantar stack local completo
docker compose up -d && npm run dev
```

---

## Decisiones tomadas y por qué

- **Next.js App Router** sobre Pages Router: más moderno, mejor soporte de Server Components, es el estándar 2025
- **Supabase** sobre PlanetScale/Neon: tiene Auth integrado, dashboard visual, plan gratuito generoso
- **Prisma** sobre Drizzle: Claude Code genera mejor código con Prisma, más contexto de entrenamiento
- **shadcn/ui** sobre MUI/Chakra: más liviano, sin dependencias pesadas, fácil de customizar
- **No React Native**: la app es responsive, no justifica mantener dos codebases al inicio
