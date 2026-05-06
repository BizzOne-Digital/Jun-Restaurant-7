export type MenuOptionView = {
  key: string;
  label: string;
  priceModifier: number;
  groupKey?: string;
  groupLabel?: string;
  minSelect?: number;
  maxSelect?: number;
  isRequired?: boolean;
  sortOrder?: number;
  badge?: string;
};

export type MenuItemView = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  ingredients?: string[];
  badges?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  options?: MenuOptionView[];
  category?: { name?: string; slug?: string };
};
