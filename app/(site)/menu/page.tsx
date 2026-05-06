"use client";

import * as React from "react";
import type { MenuItemView } from "@/types/menu";
import { MenuCard } from "@/components/site/menu-card";
import { BuildBowlModal } from "@/components/site/build-bowl-modal";
import { MenuGridSkeleton } from "@/components/site/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import Link from "next/link";
import { QuantitySelector } from "@/components/site/quantity-selector";
import { cn } from "@/lib/cn";
import { MenuItemCustomizeModal } from "@/components/site/menu-item-customize-modal";
import type { MenuSelections } from "@/lib/menu-item-options";

type Category = { _id: string; name: string; slug: string };

export default function MenuPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [activeSlug, setActiveSlug] = React.useState<string>("most-popular");
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState<MenuItemView[] | null>(null);
  const [byoOpen, setByoOpen] = React.useState(false);
  const [customizeItem, setCustomizeItem] = React.useState<MenuItemView | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        const cats = (d.categories as Category[]) ?? [];
        setCategories(cats);
      });
  }, []);

  React.useEffect(() => {
    setItems(null);
    const params = new URLSearchParams();
    params.set("category", activeSlug);
    if (search.trim()) params.set("search", search.trim());
    const t = setTimeout(() => {
      fetch(`/api/menu?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => setItems((d.items as MenuItemView[]) ?? []))
        .catch(() => setItems([]));
    }, 250);
    return () => clearTimeout(t);
  }, [activeSlug, search]);

  const cart = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const onAdd = (item: MenuItemView, qty: number) => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      quantity: qty,
      image: item.image,
    });
    toast.success(`${item.name} added`);
  };

  const onAddCustomized = (item: MenuItemView, totalPrice: number, selections: MenuSelections) => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: totalPrice,
      quantity: 1,
      image: item.image,
      selectedOptions: { menuSelections: selections },
    });
    toast.success(`${item.name} added`);
    setCustomizeItem(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
      <div>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mango-300">Menu</p>
            <h1 className="font-display text-3xl text-rice-50 sm:text-4xl">Bowls built for craving</h1>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Button type="button" className="w-full sm:w-auto" onClick={() => setByoOpen(true)}>
              Build Your Own
            </Button>
            <Link href="/build">
              <Button variant="outline" type="button" className="w-full sm:w-auto">
                Open builder page
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => setActiveSlug(c.slug)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
                activeSlug === c.slug
                  ? "bg-gradient-to-r from-coral-500 to-mango-500 text-charcoal-900"
                  : "border border-white/10 bg-white/5 text-rice-200 hover:bg-white/10"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="Search bowls, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-sm"
          />
        </div>

        {items === null ? (
          <MenuGridSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                onAdd={(qty) => onAdd(item, qty)}
                onCustomize={(item.options?.length || 0) > 0 ? () => setCustomizeItem(item) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <aside className="sticky top-24 mt-10 hidden h-fit rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-glass backdrop-blur-xl lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mango-300">Cart preview</p>
        <p className="mt-1 font-display text-2xl text-rice-50">${subtotal.toFixed(2)}</p>
        <div className="mt-4 space-y-3">
          {cart.length === 0 && <p className="text-sm text-rice-500">Your cart is empty — add a bowl!</p>}
          {cart.map((line, idx) => (
            <div key={`${line.name}-${idx}`} className="rounded-2xl border border-white/10 bg-charcoal-900/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-rice-50">{line.name}</p>
                  <p className="text-xs text-rice-400">${line.price.toFixed(2)} each</p>
                </div>
                <button type="button" className="text-xs text-coral-300 hover:underline" onClick={() => removeItem(idx)}>
                  Remove
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <QuantitySelector value={line.quantity} onChange={(n) => setQty(idx, n)} />
                <p className="text-sm font-semibold text-mango-300">${(line.price * line.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/cart" className="mt-5 block">
          <Button className="w-full" type="button">
            Review cart
          </Button>
        </Link>
      </aside>

      <BuildBowlModal open={byoOpen} onClose={() => setByoOpen(false)} />
      <MenuItemCustomizeModal
        item={customizeItem}
        open={Boolean(customizeItem)}
        onClose={() => setCustomizeItem(null)}
        onConfirm={({ totalPrice, selections }) => {
          if (!customizeItem) return;
          onAddCustomized(customizeItem, totalPrice, selections);
        }}
      />
    </div>
  );
}
