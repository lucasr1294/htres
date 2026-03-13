import { PrismaClient } from "@prisma/client";
import { calcularPrecioConAranceles } from "../lib/calculos";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cargando datos de prueba...");

  // --- Posiciones Arancelarias (definidas en skills/catalogo.md) ---
  const posIluminacion = await prisma.posicionArancelaria.upsert({
    where:  { codigo: "9405.21.00.000M" },
    update: {},
    create: {
      codigo:         "9405.21.00.000M",
      descripcion:    "Lámparas LED y eléctricas",
      derechos:       0.18,
      tasa:           0.03,
      iva:            0.21,
      ivaAdicional:   0.20,
      ganancias:      0.06,
      ingresosBrutos: 0.025,
    },
  });

  const posAsientos = await prisma.posicionArancelaria.upsert({
    where:  { codigo: "9401.79.00.900D" },
    update: {},
    create: {
      codigo:         "9401.79.00.900D",
      descripcion:    "Asientos y sillas",
      derechos:       0.35,
      tasa:           0.03,
      iva:            0.21,
      ivaAdicional:   0.20,
      ganancias:      0.06,
      ingresosBrutos: 0.025,
    },
  });

  const posCandelabros = await prisma.posicionArancelaria.upsert({
    where:  { codigo: "9405.50.00.000T" },
    update: {},
    create: {
      codigo:         "9405.50.00.000T",
      descripcion:    "Candelabros y porta-velas",
      derechos:       0.18,
      tasa:           0.03,
      iva:            0.21,
      ivaAdicional:   0.20,
      ganancias:      0.06,
      ingresosBrutos: 0.025,
    },
  });

  console.log("  ✓ Posiciones arancelarias cargadas");

  // --- Proveedor ---
  const proveedor = await prisma.proveedor.upsert({
    where:  { id: "proveedor-seed-1" },
    update: {},
    create: {
      id:              "proveedor-seed-1",
      nombre:          "Guangzhou Home Deco Co.",
      ciudad:          "Guangzhou",
      contacto:        "li.wei@gzhome.cn",
      plataforma:      "Alibaba",
      tiempoProduccion: 15,
      tiempoEnvio:     35,
      rating:          4,
    },
  });
  console.log(`  ✓ Proveedor: ${proveedor.nombre}`);

  // --- Productos con precios calculados ---
  const datosPosIluminacion = {
    derechos: 0.18, tasa: 0.03, iva: 0.21,
    ivaAdicional: 0.20, ganancias: 0.06, ingresosBrutos: 0.025,
  };

  const datosPosCandelabros = {
    derechos: 0.18, tasa: 0.03, iva: 0.21,
    ivaAdicional: 0.20, ganancias: 0.06, ingresosBrutos: 0.025,
  };

  const lampara = await prisma.producto.upsert({
    where:  { sku: "ILU-001" },
    update: {},
    create: {
      sku:                   "ILU-001",
      nombre:                "Lámpara Arco Nórdica",
      descripcion:           "Lámpara de arco con base de mármol y pantalla de lino natural",
      categoria:             "ILUMINACION",
      cantidad:              8,
      posicionArancelariaId: posIluminacion.id,
      proveedorId:           proveedor.id,
      precioFOBusd:          45.00,
      precioConArancelesUSD: calcularPrecioConAranceles(45.00, datosPosIluminacion),
      precioVentaARS:        98000,
      activo:                true,
    },
  });

  const cojin = await prisma.producto.upsert({
    where:  { sku: "TEX-001" },
    update: {},
    create: {
      sku:                   "TEX-001",
      nombre:                "Cojín Lino Natural 50cm",
      descripcion:           "Cojín de lino natural, lavable, 50x50cm",
      categoria:             "TEXTILES",
      cantidad:              20,
      proveedorId:           proveedor.id,
      precioFOBusd:          12.00,
      precioConArancelesUSD: 12.00,  // sin posición arancelaria asignada
      precioVentaARS:        28000,
      activo:                true,
    },
  });

  const veladora = await prisma.producto.upsert({
    where:  { sku: "DEC-001" },
    update: {},
    create: {
      sku:                   "DEC-001",
      nombre:                "Portavela Bronce Geométrico",
      descripcion:           "Portavela de metal con acabado bronce, diseño geométrico hexagonal",
      categoria:             "DECORACION",
      cantidad:              15,
      posicionArancelariaId: posCandelabros.id,
      proveedorId:           proveedor.id,
      precioFOBusd:          8.50,
      precioConArancelesUSD: calcularPrecioConAranceles(8.50, datosPosCandelabros),
      precioVentaARS:        22000,
      activo:                true,
    },
  });

  console.log(`  ✓ Productos: ${lampara.nombre}, ${cojin.nombre}, ${veladora.nombre}`);

  // --- Stock ---
  await prisma.stock.upsert({
    where:  { productoId: lampara.id },
    update: {},
    create: { productoId: lampara.id,  disponible: 3,  reservado: 0, enTransito: 8,  umbralAlerta: 5,  ubicacion: "Depósito A" },
  });
  await prisma.stock.upsert({
    where:  { productoId: cojin.id },
    update: {},
    create: { productoId: cojin.id,    disponible: 12, reservado: 2, enTransito: 0,  umbralAlerta: 10, ubicacion: "Depósito A" },
  });
  await prisma.stock.upsert({
    where:  { productoId: veladora.id },
    update: {},
    create: { productoId: veladora.id, disponible: 7,  reservado: 0, enTransito: 15, umbralAlerta: 5,  ubicacion: "Depósito B" },
  });

  console.log("  ✓ Stock cargado");

  // --- Orden de importación ---
  await prisma.ordenImportacion.upsert({
    where:  { id: "orden-seed-1" },
    update: {},
    create: {
      id:            "orden-seed-1",
      proveedorId:   proveedor.id,
      costoTotalUSD: 640.00,
      estado:        "EN_TRANSITO",
      fechaPedido:   new Date("2026-02-10"),
      fechaEstimada: new Date("2026-03-28"),
      tracking:      "CNSHG240312001",
      notas:         "Pedido de reposición lámparas y veladores",
      items: {
        create: [
          { productoId: lampara.id,  cantidad: 8,  precioUnit: 45.00 },
          { productoId: veladora.id, cantidad: 15, precioUnit: 8.50  },
        ],
      },
    },
  });
  console.log("  ✓ Orden EN_TRANSITO creada");

  console.log("\n✅ Seed completado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
