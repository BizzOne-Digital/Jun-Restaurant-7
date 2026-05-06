import type { BuildBowlSelection } from "@/types";

const BASE_BYO = 12.5;
const SIZE: Record<BuildBowlSelection["size"], number> = {
  small: 0,
  regular: 3.5,
};
const PROTEIN: Record<string, number> = {
  salmon: 4.5,
  tuna: 4.75,
  chicken: 3.25,
  tofu: 2.75,
  unagi: 5.5,
  steak: 5.25,
};
const TOPPING_EACH = 0.85;
const CRUNCH_EACH = 0.5;
const SAUCE_EACH = 0;

export function calculateBuildBowlPrice(sel: BuildBowlSelection): number {
  let total = BASE_BYO + SIZE[sel.size] + (PROTEIN[sel.protein] ?? 3);
  total += sel.toppings.length * TOPPING_EACH;
  total += sel.crunch.length * CRUNCH_EACH;
  total += sel.sauce.length * SAUCE_EACH;
  return Math.round(total * 100) / 100;
}

export const BUILD_BOWL_DEFAULTS: BuildBowlSelection = {
  size: "regular",
  base: "sushi rice",
  protein: "salmon",
  toppings: ["avocado", "cucumber", "edamame"],
  crunch: ["furikake"],
  sauce: ["spicy mayo"],
};
