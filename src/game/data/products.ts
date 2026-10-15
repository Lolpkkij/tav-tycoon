import type { ProductId } from "../types";

// All numbers here are placeholders. Real numbers will come later.
// quality is from 1 (low) to 3 (high).
export interface ProductDef {
  id: ProductId;
  name: string;
  unitLabel: string;
  wholesaleCost: number;
  basePrice: number;
  baseDemand: number;
  elasticity: number;
  quality: number;
}

export const PRODUCTS: ProductDef[] = [
  { id: "rice", name: "Rice", unitLabel: "5 kg bag", wholesaleCost: 18, basePrice: 22, baseDemand: 12, elasticity: 0.8, quality: 2 },
  { id: "eggs", name: "Eggs", unitLabel: "tray of 30", wholesaleCost: 11, basePrice: 14, baseDemand: 15, elasticity: 1.0, quality: 2 },
  { id: "bread", name: "Bread", unitLabel: "loaf", wholesaleCost: 2, basePrice: 3, baseDemand: 30, elasticity: 0.8, quality: 2 },
  { id: "cooking_oil", name: "Cooking Oil", unitLabel: "1 kg bottle", wholesaleCost: 5, basePrice: 7, baseDemand: 10, elasticity: 0.9, quality: 2 },
  { id: "soap", name: "Soap", unitLabel: "bar", wholesaleCost: 1, basePrice: 2, baseDemand: 20, elasticity: 1.5, quality: 2 },
];

export const PRODUCT_IDS: ProductId[] = PRODUCTS.map((product) => product.id);