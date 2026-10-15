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
export const PRICE_FACTOR_MAX = 3;

// Customer demand settings. All numbers here are placeholders.
export const LOCATION_NAME = "Kuching";
export const LOCATION_TRAFFIC = 1;
export const RANDOM_MAX_FACTOR = 2;
export const NEUTRAL_QUALITY = 2;
export const QUALITY_DEMAND_STEP = 0.15;
export const PAYDAY_END_FACTOR = 1.25; // days 25 to 30
export const PAYDAY_START_FACTOR = 1.15; // days 1 to 5
export const MIDMONTH_FACTOR = 0.95; // days 6 to 24