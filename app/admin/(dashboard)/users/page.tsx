"use client";

import * as React from "react";
import { toast } from "sonner";

type UserRow = { _id: string; name: string; email: string; role: string; isBlocked: boolean };

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserRow[]>([]);

  const load = () => fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.users ?? []));

  React.useEffect(() => {
    load();
  }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) toast.error("Update failed");
    else toast.success("Updated");
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">Users</h2>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        {/* Desktop table */}
        <table className="hidden min-w-full text-left text-sm md:table">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-rice-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Blocked</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-white/5">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-rice-400">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-lg border border-white/10 bg-charcoal-900 px-2 py-1 text-xs"
                    value={u.role}
                    onChange={(e) => patch(u._id, { role: e.target.value })}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="text-xs text-mango-300 hover:underline" onClick={() => patch(u._id, { isBlocked: !u.isBlocked })}>
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="divide-y divide-white/5 md:hidden">
          {users.map((u) => (
            <div key={u._id} className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-rice-100">{u.name}</p>
                  <p className="text-xs text-rice-400">{u.email}</p>
                </div>
                <button type="button" className="text-xs text-mango-300 hover:underline" onClick={() => patch(u._id, { isBlocked: !u.isBlocked })}>
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-rice-500">Role:</p>
                <select
                  className="rounded-lg border border-white/10 bg-charcoal-900 px-2 py-1.5 text-xs"
                  value={u.role}
                  onChange={(e) => patch(u._id, { role: e.target.value })}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
