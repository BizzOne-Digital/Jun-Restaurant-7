"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Item = {
  _id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  image?: string;
  category?: { name?: string };
};

export default function AdminMenuPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", price: "12.99", category: "" });

  const load = () => fetch("/api/admin/menu").then((r) => r.json()).then((d) => setItems(d.items ?? []));

  React.useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        const first = (d.categories as { _id: string }[] | undefined)?.[0]?._id;
        if (first) setForm((f) => ({ ...f, category: first }));
      });
    load();
  }, []);

  const toggle = async (id: string, isAvailable: boolean) => {
    await fetch(`/api/admin/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    });
    load();
  };

  const create = async () => {
    if (!form.name || !form.category) {
      toast.error("Name and category required");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: "New item — edit details after creation.",
      }),
    });
    setCreating(false);
    if (!res.ok) {
      toast.error("Failed to create");
      return;
    }
    toast.success("Menu item created");
    setForm((f) => ({ ...f, name: "", price: "12.99" }));
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Menu</h2>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-rice-100">Quick add</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input
            placeholder="Category Mongo ID"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Button type="button" onClick={create} disabled={creating}>
            Add item
          </Button>
        </div>
        <p className="mt-2 text-xs text-rice-500">
          Paste a category ID from the Categories screen — replace with a searchable picker in production.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        {/* Desktop table */}
        <table className="hidden min-w-full text-left text-sm md:table">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-rice-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Available</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-rice-100">{it.name}</td>
                <td className="px-4 py-3 text-rice-400">{it.category?.name}</td>
                <td className="px-4 py-3">${it.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <button type="button" className="text-xs text-mango-300 hover:underline" onClick={() => toggle(it._id, it.isAvailable)}>
                    {it.isAvailable ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="divide-y divide-white/5 md:hidden">
          {items.map((it) => (
            <div key={it._id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-rice-100">{it.name}</p>
                <p className="text-xs text-rice-400">{it.category?.name} · ${it.price.toFixed(2)}</p>
              </div>
              <button type="button" className="text-xs text-mango-300 hover:underline" onClick={() => toggle(it._id, it.isAvailable)}>
                {it.isAvailable ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
