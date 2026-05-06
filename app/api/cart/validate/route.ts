import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { validateCartItems } from "@/lib/cart-validate";
import type { CartItem } from "@/types";

const CartItemSchema = z.object({
  menuItemId: z.string().optional(),
  name: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(50),
  selectedOptions: z.record(z.unknown()).optional(),
  notes: z.string().max(500).optional(),
  image: z.string().max(2000).optional(),
  isBuildBowl: z.boolean().optional(),
});

const BodySchema = z.object({
  items: z.array(CartItemSchema).max(100),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`cart:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await validateCartItems(parsed.data.items as CartItem[]);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    lines: result.lines,
    subtotal: result.subtotal,
  });
}
