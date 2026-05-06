"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl text-rice-50">Sign in</h1>
      <p className="mt-2 text-sm text-rice-400">Access your saved orders and faster checkout.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          Email
          <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-rice-400">
          Password
          <Input className="mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Continue"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-rice-400">
        New here?{" "}
        <Link className="text-mango-300 hover:underline" href="/account/register">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-rice-500">
        <Link className="hover:text-rice-300" href="/account/forgot">
          Forgot password (placeholder)
        </Link>
      </p>
    </div>
  );
}
