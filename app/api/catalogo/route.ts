import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularPrecioConAranceles } from "@/lib/calculos";
import { z } from "zod";

// Validación del body de creación de producto
const productoSchema = z.object({
  sku:                   z.string().min(1, "SKU requerido"),
  nombre:                z.string().min(1, "Nombre requerido"),
  descripcion:           z.string().optional(),
  categoria:             z.enum(["ILUMINACION","DECORACION","MUEBLES","TEXTILES","ORGANIZACION","EXTERIOR","OTROS"]),
  cantidad:              z.number().int().min(1).default(1),
  posicionArancelariaId: z.string().optional(),
  proveedorId:           z.string().optional(),
  precioFOBusd:          z.number().positive("El precio FOB debe ser mayor a 0"),
  precioVentaARS:        z.number().positive("El precio de venta debe ser mayor a 0"),
  notas:                 z.string().optional(),
  activo:                z.boolean().default(true),
});

// GET /api/catalogo — lista todos los productos con stock y proveedor
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        stock:              { select: { disponible: true, umbralAlerta: true } },
        proveedor:          { select: { id: true, nombre: true } },
        posicionArancelaria:{ select: { codigo: true, descripcion: true } },
      },
      orderBy: { creadoEn: "desc" },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

// POST /api/catalogo — crea un producto nuevo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = productoSchema.parse(body);

    // Calcula precioConArancelesUSD automáticamente si hay posición arancelaria
    let precioConArancelesUSD = data.precioFOBusd;
    if (data.posicionArancelariaId) {
      const posicion = await prisma.posicionArancelaria.findUnique({
        where: { id: data.posicionArancelariaId },
      });
      if (posicion) {
        precioConArancelesUSD = calcularPrecioConAranceles(data.precioFOBusd, {
          derechos:       Number(posicion.derechos),
          tasa:           Number(posicion.tasa),
          iva:            Number(posicion.iva),
          ivaAdicional:   Number(posicion.ivaAdicional),
          ganancias:      Number(posicion.ganancias),
          ingresosBrutos: Number(posicion.ingresosBrutos),
        });
      }
    }

    const producto = await prisma.producto.create({
      data: {
        ...data,
        precioConArancelesUSD,
      },
      include: {
        posicionArancelaria: true,
        proveedor:           { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    // SKU duplicado
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "El SKU ya existe" }, { status: 409 });
    }
    console.error("Error al crear producto:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
