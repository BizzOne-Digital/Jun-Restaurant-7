import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { Promotion } from "@/models/Promotion";

const PatchSchema = z.object({
  code: z.string().min(2).max(40).optional(),
  type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().positive().optional(),
  expiryDate: z.string().optional(),
  usageLimit: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const json = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await connectDB();
  const promo = await Promotion.findById(ctx.params.id);
  if (!promo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = parsed.data;
  if (d.code !== undefined) promo.code = d.code.toUpperCase();
  if (d.type !== undefined) promo.type = d.type;
  if (d.value !== undefined) promo.value = d.value;
  if (d.expiryDate !== undefined) promo.expiryDate = new Date(d.expiryDate);
  if (d.usageLimit !== undefined) promo.usageLimit = d.usageLimit;
  if (d.isActive !== undefined) promo.isActive = d.isActive;
  await promo.save();
  return NextResponse.json({ promotion: promo });
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  await connectDB();
  await Promotion.findByIdAndDelete(ctx.params.id);
  return NextResponse.json({ ok: true });
}
