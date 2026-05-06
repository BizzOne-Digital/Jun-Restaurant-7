import { connectDB } from "@/lib/mongodb";
import { Promotion } from "@/models/Promotion";

export async function applyPromotion(
  code: string | undefined,
  subtotal: number
): Promise<{ discount: number; promoCode: string } | { discount: number; promoCode: ""; error?: string }> {
  if (!code?.trim()) return { discount: 0, promoCode: "" };
  await connectDB();
  const promo = await Promotion.findOne({ code: code.trim().toUpperCase() });
  if (!promo || !promo.isActive) {
    return { discount: 0, promoCode: "", error: "Invalid promo code" };
  }
  if (promo.expiryDate < new Date()) {
    return { discount: 0, promoCode: "", error: "Promo expired" };
  }
  if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
    return { discount: 0, promoCode: "", error: "Promo usage limit reached" };
  }
  let discount = 0;
  if (promo.type === "percentage") {
    discount = Math.round(subtotal * (promo.value / 100) * 100) / 100;
  } else {
    discount = Math.min(promo.value, subtotal);
  }
  return { discount, promoCode: promo.code };
}
