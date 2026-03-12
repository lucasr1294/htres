// Datos mock del dashboard — se usan cuando la DB no está conectada
// Reemplazar con datos reales al conectar Supabase/PostgreSQL

export const mockDashboardData = {
  isEmpty: false,

  kpis: {
    valorInventario: 128400,
    ventasMes: 3_840_000,
    ventasMesAnterior: 3_200_000,
    ordenesActivasCount: 4,
    pagosPendientes: 6200,
  },

  alertasStock: [
    { id: "1", nombre: "Lámpara Arco Nórdica",   sku: "ILU-012",     disponible: 2, umbralAlerta: 5 },
    { id: "2", nombre: "Cojín Lino Natural 50cm", sku: "TEX-034-NAT", disponible: 3, umbralAlerta: 8 },
    { id: "3", nombre: "Maceta Cerámica Negra XL",sku: "ACC-078",     disponible: 1, umbralAlerta: 4 },
  ],

  ordenesEnCamino: [
    {
      id: "ord-1",
      proveedor: "Guangzhou Home Deco Co.",
      cantidadItems: 8,
      estado: "EN_TRANSITO"  as const,
      fechaEstimada: new Date("2026-03-28"),
      tracking: "CNSHG240312001",
    },
    {
      id: "ord-2",
      proveedor: "Shenzhen Living Style Ltd.",
      cantidadItems: 3,
      estado: "EN_PRODUCCION" as const,
      fechaEstimada: new Date("2026-04-10"),
      tracking: null,
    },
    {
      id: "ord-3",
      proveedor: "Yiwu Craft & Design",
      cantidadItems: 12,
      estado: "EN_ADUANA" as const,
      fechaEstimada: new Date("2026-03-15"),
      tracking: "CNSHA240301789",
    },
  ],

  actividadReciente: [
    {
      id: "v-1",
      fecha: new Date("2026-03-12T14:30:00"),
      canal: "Instagram",
      productos: "Lámpara Arco Nórdica × 1, Cojín Lino × 2",
      totalARS: 186_000,
    },
    {
      id: "v-2",
      fecha: new Date("2026-03-12T11:15:00"),
      canal: "Tienda Nube",
      productos: "Set Macetas Terracota (3u)",
      totalARS: 94_500,
    },
    {
      id: "v-3",
      fecha: new Date("2026-03-11T17:00:00"),
      canal: "Mayorista",
      productos: "Alfombra Jute Natural 160cm × 4",
      totalARS: 520_000,
    },
    {
      id: "v-4",
      fecha: new Date("2026-03-11T10:45:00"),
      canal: "Instagram",
      productos: "Espejo Redondo Rattan 60cm × 1",
      totalARS: 78_000,
    },
    {
      id: "v-5",
      fecha: new Date("2026-03-10T16:20:00"),
      canal: "Tienda Nube",
      productos: "Canasto Mimbre Grande, Portavela Bronce",
      totalARS: 112_000,
    },
  ],

  resumenFinanciero: {
    importadoUSD: 18_400,
    vendidoARS: 3_840_000,
    tipoCambio: 1050,
    fechaTipoCambio: new Date("2026-03-10"),
  },
};
