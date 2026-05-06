import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json({ orders });
}
