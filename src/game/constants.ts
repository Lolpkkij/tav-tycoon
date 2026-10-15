import type { SlotId } from "./types";

export const SAVE_VERSION = 1;
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