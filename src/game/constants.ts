import type { SlotId } from "./types";

export const SAVE_VERSION = 2;
export const SLOT_IDS: SlotId[] = [1, 2, 3];
export const STORAGE_PREFIX = "tavtycoon_slot_";
export const DAYS_PER_MONTH = 30;
export const DAYS_PER_YEAR = 360;
export const BASE_DAY_MS = 3000;
export const START_CASH = 10000;
export const CURRENCY_NAME = "Tav";
export const MAX_NAME_LENGTH = 20;
export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const SHOP_NAME = "Corner Shop";
export const MONTHLY_RENT = 1500;
export const MONTHLY_WAGES = 1200;
export const RESTOCK_TARGET = 100;
export const DEMAND_NOISE = 0.2;
export const PRICE_FACTOR_MAX = 3;