import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/posiciones-arancelarias — lista todas las posiciones para el select del formulario
export async function GET() {
  try {
    const posiciones = await prisma.posicionArancelaria.findMany({
      orderBy: { codigo: "asc" },
    });
    return NextResponse.json(posiciones);
  } catch (error) {
    console.error("Error al obtener posiciones arancelarias:", error);
    return NextResponse.json({ error: "Error al obtener posiciones" }, { status: 500 });
  }
}
