import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { Order } from "@/models/Order";

const BodySchema = z.object({
  orderStatus: z.enum([
    "pending",
    "paid",
    "preparing",
    "ready",
    "completed",
    "cancelled",
    "refunded",
  ]),
});

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await connectDB();
  const order = await Order.findByIdAndUpdate(
    ctx.params.id,
    { $set: { orderStatus: parsed.data.orderStatus } },
    { new: true }
  );
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
