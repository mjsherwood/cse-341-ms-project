import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  cuisineType: string;
  calories: number;
  imageUrl?: string;
}

const recipeSchema = new Schema<IRecipe>({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  cuisineType: { type: String, required: true },
  calories: { type: Number, required: true },
  imageUrl: String,
});

// Add a virtual id field
recipeSchema.virtual('id').get(function (this: { _id: any; }) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
recipeSchema.set('toJSON', {
  virtuals: true
});

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

