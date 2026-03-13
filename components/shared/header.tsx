"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/catalogo":  "Catálogo de Productos",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const match = Object.keys(pageTitles).find((key) => pathname.startsWith(key + "/"));
  return match ? pageTitles[match] : "Dashboard";
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className="h-16 flex items-center px-8 border-b bg-[#F8F7F4] flex-shrink-0"
      style={{ borderColor: "var(--color-border)" }}
    >
      <h1 className="font-display font-bold text-[#111111] text-xl tracking-[0.01em]">
        {title}
      </h1>
    </header>
  );
}
