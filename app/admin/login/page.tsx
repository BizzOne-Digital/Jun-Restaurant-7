"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@onopokebar.com");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid credentials");
      return;
    }
    const me = await fetch("/api/auth/session").then((r) => r.json());
    if (me?.user?.role !== "admin") {
      toast.error("Not an admin account");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-900 px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-glass backdrop-blur-xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mango-300">Staff</p>
          <h1 className="font-display text-2xl text-rice-50">Admin login</h1>
          <p className="mt-1 text-sm text-rice-400">Use the seeded admin account in development only.</p>
        </div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          Email
          <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          Password
          <Input
            className="mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
