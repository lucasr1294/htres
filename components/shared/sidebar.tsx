"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, type LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 h-screen bg-[#111111] flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <span className="font-display font-bold text-white text-xl tracking-wide">
          HTres
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
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
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-[11px] text-[#6B6D72] font-sans tracking-widest uppercase">
          Importaciones
        </p>
      </div>
    </aside>
  );
}
