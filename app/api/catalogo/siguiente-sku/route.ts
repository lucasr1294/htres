import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PREFIJOS_SKU } from "@/lib/calculos";

// GET /api/catalogo/siguiente-sku?categoria=ILUMINACION
// Devuelve el siguiente SKU disponible para la categoría dada
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");

  if (!categoria || !PREFIJOS_SKU[categoria]) {
    return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
  }

  const prefijo = PREFIJOS_SKU[categoria];

  // Busca el SKU más alto con ese prefijo
  const ultimo = await prisma.producto.findFirst({
    where: { sku: { startsWith: `${prefijo}-` } },
    orderBy: { sku: "desc" },
    select: { sku: true },
  });

  let siguiente = 1;
  if (ultimo) {
    // Extrae el número del SKU (ej: "ILU-012" → 12)
    const partes = ultimo.sku.split("-");
    const numero = parseInt(partes[1], 10);
    if (!isNaN(numero)) siguiente = numero + 1;
  }

  const sku = `${prefijo}-${String(siguiente).padStart(3, "0")}`;
  return NextResponse.json({ sku });
}
