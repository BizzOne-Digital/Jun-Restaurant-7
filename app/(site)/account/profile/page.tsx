"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  React.useEffect(() => {
    if (status === "unauthenticated") router.push("/account/login");
  }, [status, router]);

  React.useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setName(d.user.name ?? "");
          setPhone(d.user.phone ?? "");
        }
      });
  }, [status]);

  const save = async () => {
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    if (!res.ok) toast.error("Could not save");
    else {
      toast.success("Profile updated");
      await update({ name });
      router.refresh();
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div className="mx-auto max-w-md px-4 py-8 md:py-12">
      <h1 className="font-display text-3xl text-rice-50">Profile</h1>
      <p className="mt-2 text-sm text-rice-400">{session.user?.email}</p>
      <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          Name
          <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          Phone
          <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <Button type="button" onClick={save}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
