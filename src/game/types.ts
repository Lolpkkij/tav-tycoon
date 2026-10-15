export type GameMode = "story" | "sandbox";
export type SlotId = 1 | 2 | 3;
export type GameSpeed = 0 | 1 | 2 | 5;
export type Screen = "menu" | "slots" | "newGame" | "game" | "settings";

export interface SaveData {
  version: number;
  slotId: SlotId;
  name: string;
  mode: GameMode;
  totalDays: number;
  cash: number;
  createdAt: number;
  updatedAt: number;
}