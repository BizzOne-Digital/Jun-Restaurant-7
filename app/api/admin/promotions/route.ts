import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { Promotion } from "@/models/Promotion";

const PostSchema = z.object({
  code: z.string().min(2).max(40),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  expiryDate: z.string().min(1),
  usageLimit: z.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  await connectDB();
  const promotions = await Promotion.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ promotions });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const json = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid promotion" }, { status: 400 });
  }

  await connectDB();
  const promo = await Promotion.create({
    code: parsed.data.code.toUpperCase(),
    type: parsed.data.type,
    value: parsed.data.value,
    expiryDate: new Date(parsed.data.expiryDate),
    usageLimit: parsed.data.usageLimit,
    isActive: parsed.data.isActive,
  });
  return NextResponse.json({ promotion: promo });
}
