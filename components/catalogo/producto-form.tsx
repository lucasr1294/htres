"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { ArancelDesglose } from "./arancel-desglose";
import { MargenBadge } from "./margen-badge";
import {
  calcularPrecioConAranceles,
  calcularDesglose,
  calcularMargen,
  TIPO_CAMBIO_DEFAULT,
  type DatosPosicion,
} from "@/lib/calculos";

// Tipos de posición arancelaria que vienen del select
interface PosicionOption {
  id: string;
  codigo: string;
  descripcion: string;
  derechos: number;
  tasa: number;
  iva: number;
  ivaAdicional: number;
  ganancias: number;
  ingresosBrutos: number;
}

interface ProveedorOption {
  id: string;
  nombre: string;
}

const CATEGORIAS = [
  { value: "ILUMINACION",  label: "Iluminación" },
  { value: "DECORACION",   label: "Decoración" },
  { value: "MUEBLES",      label: "Muebles" },
  { value: "TEXTILES",     label: "Textiles" },
  { value: "ORGANIZACION", label: "Organización" },
  { value: "EXTERIOR",     label: "Exterior" },
  { value: "OTROS",        label: "Otros" },
];

const schema = z.object({
  sku:                   z.string().min(1, "Requerido"),
  nombre:                z.string().min(1, "Requerido"),
  descripcion:           z.string().optional(),
  categoria:             z.enum(["ILUMINACION","DECORACION","MUEBLES","TEXTILES","ORGANIZACION","EXTERIOR","OTROS"]),
  cantidad:              z.number().int().min(1),
  posicionArancelariaId: z.string().optional(),
  proveedorId:           z.string().optional(),
  precioFOBusd:          z.number().positive("Debe ser mayor a 0"),
  precioVentaARS:        z.number().positive("Debe ser mayor a 0"),
  notas:                 z.string().optional(),
  activo:                z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductoFormProps {
  posiciones: PosicionOption[];
  proveedores: ProveedorOption[];
}

// Estilos reutilizables para inputs y labels siguiendo el design system
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #E2E0DC",
  borderRadius: "2px",
  fontFamily: "var(--font-ibm-plex-sans)",
  fontSize: "14px",
  color: "#111111",
  backgroundColor: "#FFFFFF",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-ibm-plex-sans)",
  fontWeight: 500,
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "#6B6D72",
  marginBottom: "6px",
};

export function ProductoForm({ posiciones, proveedores }: ProductoFormProps) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valores calculados en tiempo real
  const [precioConAranceles, setPrecioConAranceles] = useState(0);
  const [margen, setMargen] = useState(0);
  const [posicionSeleccionada, setPosicionSeleccionada] = useState<PosicionOption | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { activo: true, cantidad: 1, categoria: "ILUMINACION" },
  });

  const [watchCategoria, watchFOB, watchPosicion, watchVentaARS] = watch([
    "categoria", "precioFOBusd", "posicionArancelariaId", "precioVentaARS",
  ]);

  // Auto-sugiere el SKU al cambiar categoría
  useEffect(() => {
    if (!watchCategoria) return;
    fetch(`/api/catalogo/siguiente-sku?categoria=${watchCategoria}`)
      .then(r => r.json())
      .then(d => setValue("sku", d.sku))
      .catch(() => {});
  }, [watchCategoria, setValue]);

  // Recalcula precio con aranceles y margen al cambiar FOB, posición o precio ARS
  useEffect(() => {
    const fob = Number(watchFOB) || 0;
    const ars = Number(watchVentaARS) || 0;

    const posicion = posiciones.find(p => p.id === watchPosicion);
    setPosicionSeleccionada(posicion ?? null);

    let calculado = fob;
    if (posicion && fob > 0) {
      calculado = calcularPrecioConAranceles(fob, posicion as DatosPosicion);
    }

    setPrecioConAranceles(calculado);
    setMargen(calcularMargen(calculado, ars, TIPO_CAMBIO_DEFAULT));
  }, [watchFOB, watchPosicion, watchVentaARS, posiciones]);

  async function onSubmit(data: FormData) {
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/catalogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Error al guardar");
      }

      router.push("/catalogo");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">

      {/* Fila: SKU + Nombre */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>SKU</label>
          <input {...register("sku")} style={inputStyle} placeholder="ILU-001" className="font-mono" />
          {errors.sku && <p className="mt-1 text-xs" style={{ color: "#5C2E2E" }}>{errors.sku.message}</p>}
        </div>
        <div className="col-span-2">
          <label style={labelStyle}>Nombre</label>
          <input {...register("nombre")} style={inputStyle} placeholder="Lámpara Arco Nórdica" />
          {errors.nombre && <p className="mt-1 text-xs" style={{ color: "#5C2E2E" }}>{errors.nombre.message}</p>}
        </div>
      </div>

      {/* Fila: Categoría + Proveedor + Cantidad */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>Categoría</label>
          <select {...register("categoria")} style={inputStyle}>
            {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Proveedor</label>
          <select {...register("proveedorId")} style={inputStyle}>
            <option value="">Sin asignar</option>
            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Cantidad lote</label>
          <input {...register("cantidad", { valueAsNumber: true })} type="number" min={1} style={inputStyle} />
        </div>
      </div>

      {/* Posición Arancelaria */}
      <div>
        <label style={labelStyle}>Posición Arancelaria</label>
        <select {...register("posicionArancelariaId")} style={inputStyle}>
          <option value="">Sin posición (sin aranceles)</option>
          {posiciones.map(p => (
            <option key={p.id} value={p.id}>
              {p.codigo} — {p.descripcion}
            </option>
          ))}
        </select>
      </div>

      {/* Precios */}
      <div
        className="p-4 grid grid-cols-2 gap-4"
        style={{ backgroundColor: "#F0EDE8", border: "1px solid #E2E0DC" }}
      >
        {/* Precio FOB */}
        <div>
          <label style={labelStyle}>Precio FOB USD</label>
          <input
            {...register("precioFOBusd", { valueAsNumber: true })}
            type="number" step="0.01" min="0"
            style={{ ...inputStyle, fontFamily: "var(--font-ibm-plex-mono)" }}
            placeholder="0.00"
          />
          {errors.precioFOBusd && <p className="mt-1 text-xs" style={{ color: "#5C2E2E" }}>{errors.precioFOBusd.message}</p>}
        </div>

        {/* Precio con aranceles (solo lectura) */}
        <div>
          <label style={labelStyle}>Con aranceles USD <span style={{ color: "#A8AAAE", textTransform: "none", letterSpacing: 0 }}>— calculado</span></label>
          <div
            className="px-3 py-2 font-mono text-sm"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E0DC", borderRadius: "2px", color: "#111111" }}
          >
            {precioConAranceles > 0
              ? `$${precioConAranceles.toFixed(2)}`
              : <span style={{ color: "#A8AAAE" }}>—</span>
            }
          </div>
          {posicionSeleccionada && precioConAranceles > 0 && (
            <div className="mt-1">
              <ArancelDesglose
                desglose={calcularDesglose(Number(watchFOB) || 0, posicionSeleccionada as DatosPosicion)}
              />
            </div>
          )}
        </div>

        {/* Precio venta ARS */}
        <div>
          <label style={labelStyle}>Precio Venta ARS</label>
          <input
            {...register("precioVentaARS", { valueAsNumber: true })}
            type="number" step="1" min="0"
            style={{ ...inputStyle, fontFamily: "var(--font-ibm-plex-mono)" }}
            placeholder="0"
          />
          {errors.precioVentaARS && <p className="mt-1 text-xs" style={{ color: "#5C2E2E" }}>{errors.precioVentaARS.message}</p>}
        </div>

        {/* Margen estimado (solo lectura) */}
        <div>
          <label style={labelStyle}>Margen estimado <span style={{ color: "#A8AAAE", textTransform: "none", letterSpacing: 0 }}>— TC ${TIPO_CAMBIO_DEFAULT}</span></label>
          <div
            className="px-3 py-2"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E0DC", borderRadius: "2px" }}
          >
            {margen !== 0
              ? <MargenBadge margen={margen} />
              : <span className="font-mono text-sm" style={{ color: "#A8AAAE" }}>—</span>
            }
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label style={labelStyle}>Descripción</label>
        <textarea
          {...register("descripcion")}
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Descripción interna del producto…"
        />
      </div>

      {/* Notas */}
      <div>
        <label style={labelStyle}>Notas internas</label>
        <textarea
          {...register("notas")}
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Observaciones, detalles de embalaje, etc."
        />
      </div>

      {/* Activo */}
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <input type="checkbox" {...register("activo")} className="w-4 h-4" />
        <span className="font-sans text-sm" style={{ color: "#111111" }}>Producto activo</span>
      </label>

      {/* Error global */}
      {error && (
        <p className="font-sans text-sm px-3 py-2" style={{ color: "#5C2E2E", backgroundColor: "#EDE0E0", borderRadius: "2px" }}>
          {error}
        </p>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="flex items-center gap-2 px-5 py-2.5 font-sans font-medium text-sm text-white transition-opacity duration-150"
          style={{ backgroundColor: "#111111", borderRadius: 0, opacity: enviando ? 0.6 : 1 }}
        >
          {enviando && <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />}
          Guardar producto
        </button>
        <a
          href="/catalogo"
          className="px-5 py-2.5 font-sans font-medium text-sm border transition-all duration-150 hover:bg-[#F0EDE8]"
          style={{ color: "#111111", borderColor: "#111111", borderRadius: 0 }}
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
