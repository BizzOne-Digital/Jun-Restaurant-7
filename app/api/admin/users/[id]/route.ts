import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { User } from "@/models/User";

const BodySchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  isBlocked: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(ctx.params.id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (parsed.data.role !== undefined) user.role = parsed.data.role;
  if (parsed.data.isBlocked !== undefined) user.isBlocked = parsed.data.isBlocked;
  await user.save();

  const safe = user.toObject();
  delete (safe as { passwordHash?: string }).passwordHash;
  return NextResponse.json({ user: safe });
}
