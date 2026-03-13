import { prisma } from "@/lib/prisma";
import { formatUSD, formatARS } from "@/lib/utils";
import { mockDashboardData } from "@/lib/mock-dashboard";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { OrdenesEnCamino } from "@/components/dashboard/ordenes-en-camino";
import { ActividadReciente } from "@/components/dashboard/actividad-reciente";
import { ResumenFinanciero } from "@/components/dashboard/resumen-financiero";
import { OnboardingSteps } from "@/components/dashboard/onboarding-steps";
import type { OrdenEnCamino } from "@/components/dashboard/ordenes-en-camino";
import type { StockAlertItem } from "@/components/dashboard/stock-alerts";

// Refresco automático cada 60 segundos (definido en skills/dashboard.md)
export const revalidate = 60;

// Tipo de cambio por defecto hasta que exista la tabla de configuración
const TIPO_CAMBIO_DEFAULT = 1000;

async function getDashboardData() {
  // Sin DATABASE_URL configurada — usar mock directamente
  if (!process.env.DATABASE_URL) return mockDashboardData;

  try {
    const [stocks, ordenesDb, proveedorCount, productoCount] = await Promise.all([
      prisma.stock.findMany({
        include: {
          producto: {
            select: { nombre: true, sku: true, precioFOBusd: true, activo: true },
          },
        },
        where: { producto: { activo: true } },
      }),
      prisma.ordenImportacion.findMany({
        where: {
          estado: { notIn: ["RECIBIDA", "CANCELADA"] },
        },
        include: {
          proveedor: { select: { nombre: true } },
          items: { select: { id: true } },
        },
        orderBy: { fechaEstimada: "asc" },
      }),
      prisma.proveedor.count(),
      prisma.producto.count(),
    ]);

    // --- Alertas de stock bajo ---
    const alertasStock: StockAlertItem[] = stocks
      .filter((s) => s.disponible <= s.umbralAlerta)
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        nombre: s.producto.nombre,
        sku: s.producto.sku,
        disponible: s.disponible,
        umbralAlerta: s.umbralAlerta,
      }));

    // --- Valor del inventario (disponible × costo USD) ---
    const valorInventario = stocks.reduce(
      (acc, s) => acc + s.disponible * Number(s.producto.precioFOBusd),
      0
    );

    // --- Órdenes activas (excluye BORRADOR, RECIBIDA, CANCELADA) ---
    const ordenesActivas = ordenesDb.filter((o) => o.estado !== "BORRADOR");

    // --- Órdenes en camino para la sección visual ---
    const ordenesEnCamino: OrdenEnCamino[] = ordenesDb
      .filter((o) =>
        ["EN_PRODUCCION", "EN_TRANSITO", "EN_ADUANA"].includes(o.estado)
      )
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        proveedor: o.proveedor.nombre,
        cantidadItems: o.items.length,
        estado: o.estado,
        fechaEstimada: o.fechaEstimada,
        tracking: o.tracking,
      }));

    return {
      isEmpty: proveedorCount === 0 && productoCount === 0,
      kpis: {
        valorInventario,
        ordenesActivasCount: ordenesActivas.length,
        ventasMes: 0,           // sin modelo Venta aún
        ventasMesAnterior: 0,   // sin modelo Venta aún
        pagosPendientes: 0,     // sin modelo de pagos aún
      },
      alertasStock,
      ordenesEnCamino,
      actividadReciente: [],   // sin modelo Venta aún
      resumenFinanciero: {
        importadoUSD: ordenesActivas.reduce(
          (acc, o) => acc + Number(o.costoTotalUSD),
          0
        ),
        vendidoARS: 0,
        tipoCambio: TIPO_CAMBIO_DEFAULT,
        fechaTipoCambio: new Date(),
      },
    };
  } catch {
    // DB no conectada — usar datos mock para visualización
    return mockDashboardData;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  // Sin conexión a DB — estado onboarding
  if (!data) {
    return (
      <div className="space-y-8">
        <OnboardingSteps />
      </div>
    );
  }

  // DB conectada pero sin datos aún
  if (data.isEmpty) {
    return (
      <div className="space-y-8">
        <OnboardingSteps />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---- 4 KPIs superiores ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          featured
          label="Valor del inventario"
          value={formatUSD(data.kpis.valorInventario)}
          unit="USD"
        />
        <KpiCard
          label="Ventas del mes"
          value={formatARS(data.kpis.ventasMes)}
          unit="ARS"
          delta={
            data.kpis.ventasMesAnterior > 0
              ? {
                  porcentaje:
                    ((data.kpis.ventasMes - data.kpis.ventasMesAnterior) /
                      data.kpis.ventasMesAnterior) *
                    100,
                  descripcion: "vs mes anterior",
                }
              : undefined
          }
        />
        <KpiCard
          label="Órdenes activas"
          value={String(data.kpis.ordenesActivasCount)}
        />
        <KpiCard
          label="Pagos pendientes"
          value={formatUSD(data.kpis.pagosPendientes)}
          unit="USD"
        />
      </div>

      {/* ---- Alertas de stock + Resumen financiero ---- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StockAlerts items={data.alertasStock} />
        <ResumenFinanciero data={data.resumenFinanciero} />
      </div>

      {/* ---- Órdenes en camino ---- */}
      <OrdenesEnCamino ordenes={data.ordenesEnCamino} />

      {/* ---- Actividad reciente ---- */}
      <ActividadReciente ventas={data.actividadReciente} />
    </div>
  );
}
