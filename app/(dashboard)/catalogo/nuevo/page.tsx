import { prisma } from "@/lib/prisma";
import { ProductoForm } from "@/components/catalogo/producto-form";

// Carga posiciones arancelarias y proveedores para los selects del formulario
async function getFormData() {
  const [posiciones, proveedores] = await Promise.all([
    prisma.posicionArancelaria.findMany({ orderBy: { codigo: "asc" } }),
    prisma.proveedor.findMany({ orderBy: { nombre: "asc" }, select: { id: true, nombre: true } }),
  ]);

  // Convertir Decimal a number para el componente cliente
  return {
    posiciones: posiciones.map(p => ({
      ...p,
      derechos:       Number(p.derechos),
      tasa:           Number(p.tasa),
      iva:            Number(p.iva),
      ivaAdicional:   Number(p.ivaAdicional),
      ganancias:      Number(p.ganancias),
      ingresosBrutos: Number(p.ingresosBrutos),
    })),
    proveedores,
  };
}

export default async function NuevoProductoPage() {
  const { posiciones, proveedores } = await getFormData();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="font-sans text-sm" style={{ color: "#6B6D72" }}>
          El SKU se auto-sugiere según la categoría. El precio con aranceles se calcula automáticamente.
        </p>
      </div>

      <ProductoForm posiciones={posiciones} proveedores={proveedores} />
    </div>
  );
}
