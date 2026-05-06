import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-charcoal-900 text-rice-50">
      <AdminSidebar />
      <div className="flex-1 pt-12 md:pt-0">
        <header className="border-b border-white/10 bg-charcoal-950/70 px-4 py-4 backdrop-blur-xl md:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-mango-300">Dashboard</p>
          <h1 className="font-display text-xl">Operations</h1>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
