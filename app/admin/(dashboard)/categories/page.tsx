"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Cat = { _id: string; name: string; slug: string; sortOrder: number; isActive: boolean };

export default function AdminCategoriesPage() {
  const [cats, setCats] = React.useState<Cat[]>([]);
  const [name, setName] = React.useState("");

  const load = () => fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCats(d.categories ?? []));

  React.useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sortOrder: cats.length + 1 }),
    });
    if (!res.ok) {
      toast.error("Could not create");
      return;
    }
    toast.success("Category created");
    setName("");
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="button" onClick={create}>
          Add
        </Button>
      </div>
      <ul className="space-y-2 text-sm text-rice-200">
        {cats.map((c) => (
          <li key={c._id} className="flex justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span>
              {c.name} <span className="text-rice-500">({c.slug})</span>
            </span>
            <span className="text-rice-500">order {c.sortOrder}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
