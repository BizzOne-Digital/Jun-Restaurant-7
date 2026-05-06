import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const OptionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
    groupKey: { type: String, default: "extras" },
    groupLabel: { type: String, default: "Extras" },
    minSelect: { type: Number, default: 0 },
    maxSelect: { type: Number, default: 1 },
    isRequired: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    badge: { type: String, default: "" },
  },
  { _id: false }
);

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String, default: "" },
    ingredients: { type: [String], default: [] },
    badges: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    /** Extra modifiers / add-ons for admin-managed items */
    options: { type: [OptionSchema], default: [] },
  },
  { timestamps: true }
);

MenuItemSchema.index({ category: 1, name: 1 });
MenuItemSchema.index({ isFeatured: 1, isPopular: 1 });

export type MenuItemDoc = InferSchemaType<typeof MenuItemSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const MenuItem = models.MenuItem ?? model("MenuItem", MenuItemSchema);
