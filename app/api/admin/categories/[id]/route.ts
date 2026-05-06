import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { Category } from "@/models/Category";
import { slugify } from "@/lib/slug";

const PatchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().optional(),
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
  const cat = await Category.findById(ctx.params.id);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (parsed.data.name !== undefined) {
    cat.name = parsed.data.name;
    cat.slug = slugify(parsed.data.name);
  }
  if (parsed.data.description !== undefined) cat.description = parsed.data.description;
  if (parsed.data.sortOrder !== undefined) cat.sortOrder = parsed.data.sortOrder;
  if (parsed.data.isActive !== undefined) cat.isActive = parsed.data.isActive;
  await cat.save();
  return NextResponse.json({ category: cat });
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  await connectDB();
  await Category.findByIdAndDelete(ctx.params.id);
  return NextResponse.json({ ok: true });
}
