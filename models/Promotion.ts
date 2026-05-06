import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const PromotionSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type PromotionDoc = InferSchemaType<typeof PromotionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Promotion = models.Promotion ?? model("Promotion", PromotionSchema);
