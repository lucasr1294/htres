import type { EstadoOrden } from "@prisma/client";

// Estilos de badge por estado — definidos en skills/frontend.md
const estadoConfig: Record<EstadoOrden, { bg: string; color: string; label: string }> = {
  BORRADOR:      { bg: "#F0EDE8", color: "#6B6D72", label: "Borrador" },
  CONFIRMADA:    { bg: "#E8EDF0", color: "#2E4A5C", label: "Confirmada" },
  EN_PRODUCCION: { bg: "#F0EDE0", color: "#5C4A2E", label: "En producción" },
  EN_TRANSITO:   { bg: "#EDE8D8", color: "#7A5C2E", label: "En tránsito" },
  EN_ADUANA:     { bg: "#E8E0D0", color: "#7A5C2E", label: "En aduana" },
  RECIBIDA:      { bg: "#E0EDE0", color: "#3D5A3E", label: "Recibida" },
  CANCELADA:     { bg: "#EDE0E0", color: "#5C2E2E", label: "Cancelada" },
};

interface EstadoBadgeProps {
  estado: EstadoOrden;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const { bg, color, label } = estadoConfig[estado];

  return (
    <span
      className="inline-block px-2 py-0.5 font-sans font-medium uppercase tracking-wider"
      style={{
        fontSize: "11px",
        backgroundColor: bg,
        color,
        borderRadius: 0, // sin border-radius según design system
      }}
    >
      {label}
    </span>
  );
}
