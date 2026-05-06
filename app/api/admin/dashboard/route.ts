import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-guard";
import { Order } from "@/models/Order";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  await connectDB();

  const agg = await Order.aggregate([
    {
      $facet: {
        counts: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              revenue: {
                $sum: {
                  $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$total", 0],
                },
              },
              pending: {
                $sum: {
                  $cond: [{ $in: ["$orderStatus", ["pending", "paid", "preparing", "ready"]] }, 1, 0],
                },
              },
              completed: {
                $sum: { $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0] },
              },
            },
          },
        ],
        statusBreakdown: [{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }],
        recent: [
          { $sort: { createdAt: -1 } },
          { $limit: 8 },
          {
            $project: {
              orderNumber: 1,
              total: 1,
              orderStatus: 1,
              paymentStatus: 1,
              customerName: 1,
              createdAt: 1,
            },
          },
        ],
        daily: [
          {
            $match: {
              createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
              paymentStatus: "paid",
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              sales: { $sum: "$total" },
            },
          },
          { $sort: { _id: 1 } },
        ],
        popular: [
          { $match: { paymentStatus: "paid" } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.name",
              count: { $sum: "$items.quantity" },
              revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 6 },
        ],
      },
    },
  ]);

  const totals = agg[0] ?? {
    counts: [],
    statusBreakdown: [],
    recent: [],
    daily: [],
    popular: [],
  };

  const c = totals.counts[0] ?? {
    totalOrders: 0,
    revenue: 0,
    pending: 0,
    completed: 0,
  };

  return NextResponse.json({
    totalOrders: c.totalOrders ?? 0,
    revenue: Math.round((c.revenue ?? 0) * 100) / 100,
    pending: c.pending ?? 0,
    completed: c.completed ?? 0,
    statusBreakdown: totals.statusBreakdown,
    recentOrders: totals.recent,
    dailySales: totals.daily,
    popularItems: totals.popular,
  });
}
