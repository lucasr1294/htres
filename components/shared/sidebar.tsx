"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Ship,
  Building2,
  BarChart2,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Módulos principales definidos en SPEC.md
const navMain: NavItem[] = [
  { label: "Dashboard",   href: "/dashboard",    icon: LayoutDashboard },
  { label: "Catálogo",    href: "/catalogo",     icon: Layers },
  { label: "Stock",       href: "/stock",        icon: Package },
  { label: "Órdenes",     href: "/ordenes",      icon: Ship },
  { label: "Proveedores", href: "/proveedores",  icon: Building2 },
  { label: "Reportes",    href: "/reportes",     icon: BarChart2 },
];

// Módulo de admin — separado visualmente en el pie del sidebar
const navBottom: NavItem[] = [
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={[
        "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150",
        "border-l-2",
        isActive
          ? "border-white text-white bg-white/5"
          : "border-transparent text-[#A8AAAE] hover:text-white hover:bg-white/5",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="font-sans">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-[240px] flex-shrink-0 h-screen bg-[#111111] flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <span className="font-display font-bold text-white text-xl tracking-wide">
          HTres
        </span>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navMain.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Configuración — separada al pie, solo admin */}
      <div className="px-3 pb-3 border-t border-white/10 pt-3">
        {navBottom.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </div>
    </aside>
  );
}
