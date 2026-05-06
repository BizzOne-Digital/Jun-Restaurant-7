import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { User } from "@/models/User";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  await connectDB();
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  return NextResponse.json({ users });
}
