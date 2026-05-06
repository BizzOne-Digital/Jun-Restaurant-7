"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminHomePage() {
  const [data, setData] = React.useState<{
    totalOrders: number;
    revenue: number;
    pending: number;
    completed: number;
    statusBreakdown: { _id: string; count: number }[];
    recentOrders: { orderNumber: string; total: number; orderStatus: string; customerName: string; createdAt: string }[];
    dailySales: { _id: string; sales: number }[];
    popularItems: { _id: string; count: number; revenue: number }[];
  } | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) =>
        setData({
          ...d,
          statusBreakdown: d.statusBreakdown ?? [],
          recentOrders: d.recentOrders ?? [],
          dailySales: d.dailySales ?? [],
          popularItems: d.popularItems ?? [],
        })
      )
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p className="text-rice-400">Loading analytics…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total orders", value: data.totalOrders },
          { label: "Revenue (paid)", value: `$${data.revenue.toFixed(2)}` },
          { label: "Active pipeline", value: data.pending },
          { label: "Completed", value: data.completed },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-wide text-rice-500">{c.label}</p>
            <p className="mt-2 font-display text-2xl text-rice-50">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-rice-100">Daily sales (7d, paid)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                <XAxis dataKey="_id" stroke="#cbd5e1" fontSize={12} />
                <YAxis stroke="#cbd5e1" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #ffffff22", borderRadius: 12 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="sales" fill="#ff6b5c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-rice-100">Order status breakdown</p>
          <ul className="mt-4 space-y-2 text-sm text-rice-300">
            {data.statusBreakdown.map((s) => (
              <li key={s._id} className="flex justify-between">
                <span className="capitalize">{s._id}</span>
                <span className="font-semibold text-mango-300">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-rice-100">Popular items</p>
          <ul className="mt-3 space-y-2 text-sm text-rice-300">
            {data.popularItems.map((p) => (
              <li key={p._id} className="flex justify-between gap-3">
                <span>{p._id}</span>
                <span className="text-mango-300">
                  {p.count} bowls · ${p.revenue.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-rice-100">Recent orders</p>
          <ul className="mt-3 space-y-2 text-sm text-rice-300">
            {data.recentOrders.map((o) => (
              <li key={o.orderNumber} className="flex justify-between gap-3">
                <span>
                  {o.orderNumber} · {o.customerName}
                </span>
                <span className="text-rice-100">${o.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
