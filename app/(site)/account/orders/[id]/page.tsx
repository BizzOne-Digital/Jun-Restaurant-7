import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { StatusBadge } from "@/components/ui/status-badge";

type Params = { params: { id: string } };

export default async function OrderDetailPage({ params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/account/login");

  await connectDB();
  const order = await Order.findById(params.id).lean<{
    userId?: { toString: () => string } | null;
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
    items?: { name: string; quantity: number; price: number }[];
    total: number;
  } | null>();
  if (!order) notFound();
  if (order.userId?.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/account/orders");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Link href="/account/orders" className="text-sm text-mango-300 hover:underline">
        ← Back to orders
      </Link>
      <h1 className="mt-4 font-display text-3xl text-rice-50">{order.orderNumber}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <StatusBadge status={order.orderStatus} />
        <StatusBadge status={order.paymentStatus} />
      </div>
      <div className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-rice-200">
        {order.items?.map((it, i) => (
          <div key={i} className="flex justify-between gap-3">
            <span>
              {it.quantity}× {it.name}
            </span>
            <span>${(it.price * it.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-white/10 pt-3 font-semibold text-rice-50">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
