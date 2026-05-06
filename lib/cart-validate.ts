import { connectDB } from "@/lib/mongodb";
import { MenuItem } from "@/models/MenuItem";
import type { CartItem } from "@/types";
import { calculateBuildBowlPrice } from "@/lib/build-bowl-pricing";
import type { BuildBowlSelection } from "@/types";
import { calculateSelectionsPrice, type MenuOptionLike, type MenuSelections } from "@/lib/menu-item-options";

export type ValidatedLine = {
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
  selectedOptions?: Record<string, unknown>;
};

export async function validateCartItems(items: CartItem[]): Promise<{
  ok: true;
  lines: ValidatedLine[];
  subtotal: number;
} | { ok: false; error: string }> {
  if (!items.length) return { ok: false, error: "Cart is empty" };

  await connectDB();
  const lines: ValidatedLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.quantity < 1 || item.quantity > 50) {
      return { ok: false, error: "Invalid quantity" };
    }

    if (item.isBuildBowl && item.selectedOptions?.build) {
      const build = item.selectedOptions.build as BuildBowlSelection;
      const price = calculateBuildBowlPrice(build);
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      lines.push({
        name: item.name,
        price,
        quantity: item.quantity,
        image: item.image,
        notes: item.notes,
        selectedOptions: item.selectedOptions,
      });
      continue;
    }

    if (!item.menuItemId) {
      return { ok: false, error: "Invalid cart item" };
    }

    const doc = await MenuItem.findById(item.menuItemId).lean<{
      _id: { toString: () => string };
      name: string;
      price: number;
      isAvailable: boolean;
      image?: string;
      options?: MenuOptionLike[];
    } | null>();
    if (!doc || !doc.isAvailable) {
      return { ok: false, error: `Item unavailable: ${item.name}` };
    }
    let price = doc.price;
    if (doc.options?.length) {
      const rawSelections = item.selectedOptions?.menuSelections;
      const selections: MenuSelections =
        rawSelections && typeof rawSelections === "object" && !Array.isArray(rawSelections)
          ? (rawSelections as MenuSelections)
          : {};
      const selectionPrice = calculateSelectionsPrice(doc.options, selections);
      if (!selectionPrice.ok) {
        return { ok: false, error: `${doc.name}: ${selectionPrice.error}` };
      }
      price = Math.round((doc.price + selectionPrice.extra) * 100) / 100;
    }
    if (Math.abs(price - item.price) > 0.02) {
      return { ok: false, error: `Price changed for ${doc.name}. Refresh menu.` };
    }
    const lineTotal = price * item.quantity;
    subtotal += lineTotal;
    lines.push({
      menuItemId: doc._id.toString(),
      name: doc.name,
      price,
      quantity: item.quantity,
      image: doc.image || item.image,
      notes: item.notes,
      selectedOptions: item.selectedOptions,
    });
  }

  return { ok: true, lines, subtotal: Math.round(subtotal * 100) / 100 };
}
