import Link from "next/link";
import { Building2, Layers, Ship } from "lucide-react";

// Steps de onboarding cuando el negocio es nuevo y no hay datos
const steps = [
  {
    numero: "01",
    label: "Agregá tu primer proveedor",
    descripcion: "Registrá los contactos en China desde donde importás.",
    href: "/proveedores",
    icon: Building2,
  },
  {
    numero: "02",
    label: "Cargá tus productos",
    descripcion: "Creá el catálogo con SKUs, precios y categorías.",
    href: "/catalogo",
    icon: Layers,
  },
  {
    numero: "03",
    label: "Creá tu primera orden",
    descripcion: "Registrá una importación y seguí su estado en tiempo real.",
    href: "/ordenes/nueva",
    icon: Ship,
  },
];

export function OnboardingSteps() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="font-display font-bold"
          style={{ fontSize: "22px", color: "#111111" }}
        >
          Bienvenido a HTres
        </h2>
        <p className="font-sans text-sm mt-1" style={{ color: "#6B6D72" }}>
          Para ver el dashboard con datos reales, completá estos tres pasos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Link
              key={step.numero}
              href={step.href}
              className="group flex flex-col gap-4 p-6 border transition-all duration-150 hover:border-[#111111]"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E2E0DC",
                borderRadius: "4px",
              }}
            >
              {/* Número y ícono */}
              <div className="flex items-center justify-between">
                <span
                  className="font-mono"
                  style={{ fontSize: "11px", color: "#A8AAAE" }}
                >
                  {step.numero}
                </span>
                <Icon size={16} strokeWidth={1.5} style={{ color: "#A8AAAE" }} />
              </div>

              {/* Texto */}
              <div>
                <p
                  className="font-sans font-medium text-sm"
                  style={{ color: "#111111" }}
                >
                  {step.label}
                </p>
                <p
                  className="font-sans mt-1"
                  style={{ fontSize: "12px", color: "#6B6D72" }}
                >
                  {step.descripcion}
                </p>
              </div>

              {/* CTA */}
              <span
                className="font-sans font-medium mt-auto"
                style={{ fontSize: "12px", color: "#111111" }}
              >
                Empezar →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
