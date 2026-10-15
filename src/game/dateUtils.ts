import { CURRENCY_NAME, DAYS_PER_MONTH, DAYS_PER_YEAR, MONTH_NAMES } from "./constants";

export function getDateParts(totalDays: number): { day: number; month: number; year: number } {
  const year = Math.floor(totalDays / DAYS_PER_YEAR) + 1;
  const month = Math.floor((totalDays % DAYS_PER_YEAR) / DAYS_PER_MONTH) + 1;
  const day = (totalDays % DAYS_PER_MONTH) + 1;
  return { day, month, year };
}

export function formatDate(totalDays: number): string {
  const { day, month, year } = getDateParts(totalDays);
  return day + " " + MONTH_NAMES[month - 1] + ", Year " + year;
}

export function formatCash(cash: number): string {
  return Math.round(cash).toLocaleString("en-US") + " " + CURRENCY_NAME;
}