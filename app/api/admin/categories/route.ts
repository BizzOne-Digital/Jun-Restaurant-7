import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { Category } from "@/models/Category";
import { slugify } from "@/lib/slug";

const PostSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  await connectDB();
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const json = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  await connectDB();
  const slug = slugify(parsed.data.name);
  const exists = await Category.findOne({ slug });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const cat = await Category.create({ ...parsed.data, slug });
  return NextResponse.json({ category: cat });
}
