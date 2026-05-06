import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MenuItem } from "@/models/MenuItem";

export async function GET(_req: Request, context: { params: { slug: string } }) {
  try {
    const { slug } = context.params;
    await connectDB();
    const item = await MenuItem.findOne({ slug, isAvailable: true })
      .populate("category", "name slug")
      .lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load item" }, { status: 500 });
  }
}
