"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Cat = { _id: string; name: string; slug: string; sortOrder: number; isActive: boolean };

export default function AdminCategoriesPage() {
  const [cats, setCats] = React.useState<Cat[]>([]);
  const [name, setName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ name: "", sortOrder: "0", isActive: true });

  const load = () => fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCats(d.categories ?? []));

  React.useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) {
      toast.error("Category name required");
      return;
    }
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), sortOrder: cats.length + 1 }),
    });
    if (!res.ok) {
      toast.error("Could not create");
      return;
    }
    toast.success("Category created");
    setName("");
    load();
  };

  const startEdit = (cat: Cat) => {
    setEditingId(cat._id);
    setEditForm({ name: cat.name, sortOrder: String(cat.sortOrder), isActive: cat.isActive });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", sortOrder: "0", isActive: true });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name.trim()) {
      toast.error("Category name required");
      return;
    }
    const sortOrder = Number(editForm.sortOrder);
    if (!Number.isFinite(sortOrder)) {
      toast.error("Sort order must be a number");
      return;
    }
    setSavingId(id);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name.trim(),
        sortOrder,
        isActive: editForm.isActive,
      }),
    });
    setSavingId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not update category");
      return;
    }
    toast.success("Category updated");
    cancelEdit();
    load();
  };

  const removeCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not delete category");
      return;
    }
    toast.success("Category deleted");
    if (editingId === id) cancelEdit();
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
          <li key={c._id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            {editingId === c._id ? (
              <div className="space-y-3">
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Category name"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    className="w-28"
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    placeholder="Order"
                  />
                  <label className="inline-flex items-center gap-2 text-xs text-rice-400">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
                    />
                    Active
                  </label>
                </div>
                <div className="flex gap-3 text-xs">
                  <button
                    type="button"
                    className="text-avocado-400 hover:underline"
                    onClick={() => saveEdit(c._id)}
                    disabled={savingId === c._id}
                  >
                    {savingId === c._id ? "Saving..." : "Save"}
                  </button>
                  <button type="button" className="text-rice-400 hover:underline" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  {c.name} <span className="text-rice-500">({c.slug})</span>
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-rice-500">order {c.sortOrder}</span>
                  <span className={c.isActive ? "text-avocado-400" : "text-rice-500"}>
                    {c.isActive ? "active" : "inactive"}
                  </span>
                  <button type="button" className="text-ocean-300 hover:underline" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-coral-300 hover:underline"
                    onClick={() => removeCategory(c._id)}
                    disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
