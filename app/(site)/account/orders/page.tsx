import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/account/login");

  await connectDB();
  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<
      {
        _id: { toString(): string };
        orderNumber: string;
        createdAt: Date;
        total: number;
        orderStatus: string;
      }[]
    >();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="font-display text-3xl text-rice-50">My orders</h1>
      <div className="mt-6 space-y-3">
        {orders.length === 0 && <p className="text-sm text-rice-400">No orders yet — your bowls are waiting.</p>}
        {orders.map((o) => (
          <Link
            key={o._id.toString()}
            href={`/account/orders/${o._id.toString()}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:border-white/20"
          >
            <div>
              <p className="font-semibold text-rice-50">{o.orderNumber}</p>
              <p className="text-xs text-rice-500">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-mango-300">${o.total.toFixed(2)}</p>
              <p className="text-xs capitalize text-rice-400">{o.orderStatus}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
