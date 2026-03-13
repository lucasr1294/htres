import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cargando datos de prueba...");

  // --- Proveedor ---
  const proveedor = await prisma.proveedor.upsert({
    where: { id: "proveedor-seed-1" },
    update: {},
    create: {
      id: "proveedor-seed-1",
      nombre: "Guangzhou Home Deco Co.",
      ciudad: "Guangzhou",
      contacto: "li.wei@gzhome.cn",
      plataforma: "Alibaba",
      tiempoProduccion: 15,
      tiempoEnvio: 35,
      rating: 4,
    },
  });
  console.log(`  ✓ Proveedor: ${proveedor.nombre}`);

  // --- Productos ---
  const lampara = await prisma.producto.upsert({
    where: { sku: "ILU-012" },
    update: {},
    create: {
      sku: "ILU-012",
      nombre: "Lámpara Arco Nórdica",
      descripcion: "Lámpara de arco con base de mármol y pantalla de lino",
      categoria: "Iluminación",
      precioUSD: 45.00,
      precioARS: 47250.00,
      activo: true,
    },
  });

  const cojin = await prisma.producto.upsert({
    where: { sku: "TEX-034-NAT" },
    update: {},
    create: {
      sku: "TEX-034-NAT",
      nombre: "Cojín Lino Natural 50cm",
      descripcion: "Cojín de lino natural, lavable, 50x50cm",
      categoria: "Textiles",
      precioUSD: 12.00,
      precioARS: 12600.00,
      activo: true,
    },
  });
  console.log(`  ✓ Productos: ${lampara.nombre}, ${cojin.nombre}`);

  // --- Stock ---
  await prisma.stock.upsert({
    where: { productoId: lampara.id },
    update: {},
    create: {
      productoId: lampara.id,
      disponible: 3,
      reservado: 0,
      enTransito: 8,
      umbralAlerta: 5,
      ubicacion: "Depósito A",
    },
  });

  await prisma.stock.upsert({
    where: { productoId: cojin.id },
    update: {},
    create: {
      productoId: cojin.id,
      disponible: 12,
      reservado: 2,
      enTransito: 0,
      umbralAlerta: 10,
      ubicacion: "Depósito A",
    },
  });
  console.log("  ✓ Stock cargado");

  // --- Orden de importación ---
  await prisma.ordenImportacion.upsert({
    where: { id: "orden-seed-1" },
    update: {},
    create: {
      id: "orden-seed-1",
      proveedorId: proveedor.id,
      costoTotalUSD: 640.00,
      estado: "EN_TRANSITO",
      fechaPedido: new Date("2026-02-10"),
      fechaEstimada: new Date("2026-03-28"),
      tracking: "CNSHG240312001",
      notas: "Pedido de reposición lámparas",
      items: {
        create: [
          { productoId: lampara.id, cantidad: 8, precioUnit: 45.00 },
          { productoId: cojin.id,   cantidad: 20, precioUnit: 12.00 },
        ],
      },
    },
  });
  console.log("  ✓ Orden EN_TRANSITO creada");

  console.log("\n✅ Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
