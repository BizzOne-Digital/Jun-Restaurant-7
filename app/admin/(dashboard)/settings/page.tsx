"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Form = {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  logo: string;
};

const empty: Form = {
  restaurantName: "",
  address: "",
  phone: "",
  email: "",
  openingHours: "",
  logo: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = React.useState<Form>(empty);

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings as Partial<Form> | null;
        if (!s) return;
        setForm({
          restaurantName: s.restaurantName ?? "",
          address: s.address ?? "",
          phone: s.phone ?? "",
          email: s.email ?? "",
          openingHours: s.openingHours ?? "",
          logo: s.logo ?? "",
        });
      });
  }, []);

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) toast.error("Save failed");
    else toast.success("Saved");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h2 className="font-display text-2xl">Site settings</h2>
      <p className="text-sm text-rice-400">Swap logo path for CDN or uploaded asset URLs.</p>
      {(Object.keys(form) as (keyof Form)[]).map((key) => (
        <label key={key} className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          {key}
          {key === "openingHours" ? (
            <Textarea className="mt-1" value={form[key]} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} />
          ) : (
            <Input className="mt-1" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          )}
        </label>
      ))}
      <Button type="button" onClick={save}>
        Save settings
      </Button>
    </div>
  );
}
