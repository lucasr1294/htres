import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";

// Layout protegido — todas las páginas del dashboard usan este layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F7F4]">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Área principal: header + contenido */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
