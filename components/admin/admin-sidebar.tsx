"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-charcoal-950/80 p-4 md:flex">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.25em] text-mango-300">ONO Admin</p>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium",
                pathname === l.href ? "bg-white/10 text-rice-50" : "text-rice-300 hover:bg-white/5"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="mt-4 rounded-xl border border-white/10 px-3 py-2 text-left text-sm text-rice-300 hover:bg-white/5"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-charcoal-950/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mango-300">ONO Admin</p>
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-rice-200"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-charcoal-950/95 px-4 pt-16 pb-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-1 flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium",
                  pathname === l.href ? "bg-white/10 text-rice-50" : "text-rice-300 hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="mt-4 rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-rice-300 hover:bg-white/5"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
