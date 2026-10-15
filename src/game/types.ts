export type GameMode = "story" | "sandbox";
export type SlotId = 1 | 2 | 3;
export type GameSpeed = 0 | 1 | 2 | 5;
export type Screen = "menu" | "slots" | "newGame" | "game" | "settings";

export type ProductId = "rice" | "eggs" | "bread" | "cooking_oil" | "soap";
export type ProductNumbers = Record<ProductId, number>;

export interface ShopState {
  name: string;
  stock: ProductNumbers;
  prices: ProductNumbers;
  lastDayRevenue: number;
  lastDayUnits: number;
}

export interface SaveData {
  version: number;
  slotId: SlotId;
  name: string;
  mode: GameMode;
  totalDays: number;
  cash: number;
  createdAt: number;
  updatedAt: number;
  rngState: number;
  shop: ShopState;
}

export interface StatusMessage {
  text: string;
  ok: boolean;
}