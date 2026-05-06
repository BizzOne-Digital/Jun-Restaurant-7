"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Promo = {
  _id: string;
  code: string;
  type: string;
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
};

export default function AdminPromotionsPage() {
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [form, setForm] = React.useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "10",
    expiry: "",
    limit: "100",
  });

  const load = () => fetch("/api/admin/promotions").then((r) => r.json()).then((d) => setPromos(d.promotions ?? []));

  React.useEffect(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    setForm((f) => ({ ...f, expiry: d.toISOString().slice(0, 10) }));
    load();
  }, []);

  const create = async () => {
    const res = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        expiryDate: new Date(form.expiry).toISOString(),
        usageLimit: Number(form.limit || 0),
      }),
    });
    if (!res.ok) toast.error("Failed");
    else toast.success("Promotion created");
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Promotions</h2>
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 md:grid-cols-5">
        <Input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <select
          className="rounded-xl border border-white/10 bg-charcoal-900 px-3 py-3 text-sm"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
        >
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
        </select>
        <Input placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <Input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
        <Input placeholder="Usage limit" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
        <Button type="button" className="sm:col-span-2 md:col-span-5" onClick={create}>
          Create promotion
        </Button>
      </div>

      <ul className="space-y-2 text-sm">
        {promos.map((p) => (
          <li key={p._id} className="flex justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="font-semibold text-mango-300">{p.code}</span>
            <span className="text-rice-300">
              {p.type} {p.value} · used {p.usedCount}/{p.usageLimit || "∞"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
