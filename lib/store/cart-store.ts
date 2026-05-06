"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import type { BuildBowlSelection } from "@/types";
import { calculateBuildBowlPrice } from "@/lib/build-bowl-pricing";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  setQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clear: () => void;
  addBuildBowl: (build: BuildBowlSelection, quantity?: number) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const quantity = item.quantity ?? 1;
        const next = [...get().items];

        if (item.isBuildBowl) {
          const idx = next.findIndex(
            (x) =>
              x.isBuildBowl &&
              JSON.stringify(x.selectedOptions ?? {}) === JSON.stringify(item.selectedOptions ?? {})
          );
          if (idx >= 0) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            set({ items: next });
            return;
          }
          next.push({ ...item, quantity });
          set({ items: next });
          return;
        }

        if (item.menuItemId) {
          const idx = next.findIndex(
            (x) =>
              !x.isBuildBowl &&
              x.menuItemId === item.menuItemId &&
              (x.notes || "") === (item.notes || "") &&
              JSON.stringify(x.selectedOptions ?? {}) === JSON.stringify(item.selectedOptions ?? {})
          );
          if (idx >= 0) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            set({ items: next });
            return;
          }
        }

        next.push({ ...item, quantity });
        set({ items: next });
      },
      setQty: (index, qty) => {
        const next = [...get().items];
        if (!next[index]) return;
        if (qty < 1) {
          next.splice(index, 1);
        } else {
          next[index] = { ...next[index], quantity: qty };
        }
        set({ items: next });
      },
      removeItem: (index) => {
        const next = [...get().items];
        next.splice(index, 1);
        set({ items: next });
      },
      clear: () => set({ items: [] }),
      addBuildBowl: (build, quantity = 1) => {
        const price = calculateBuildBowlPrice(build);
        get().addItem({
          menuItemId: "",
          name: "Build Your Own Bowl",
          price,
          quantity,
          isBuildBowl: true,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
          selectedOptions: { build },
        });
      },
    }),
    { name: "ono-cart" }
  )
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}
