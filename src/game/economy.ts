import type { ProductId, ProductNumbers, SaveData, ShopState } from "./types";
import {
  DAYS_PER_MONTH,
  LOCATION_TRAFFIC,
  MIDMONTH_FACTOR,
  MONTHLY_RENT,
  MONTHLY_WAGES,
  NEUTRAL_QUALITY,
  PAYDAY_END_FACTOR,
  PAYDAY_START_FACTOR,
  PRICE_FACTOR_MAX,
  QUALITY_DEMAND_STEP,
  RANDOM_MAX_FACTOR,
  RESTOCK_TARGET,
  SHOP_NAME,
} from "./constants";
import type { ProductDef } from "./data/products";
import { PRODUCTS } from "./data/products";
import { nextRandom } from "./rng";

// The player may set a price from half of the base price up to double the base price.
const PRICE_LIMIT_LOW = 0.5;
const PRICE_LIMIT_HIGH = 2;

function mapProducts(pick: (product: ProductDef) => number): ProductNumbers {
  const result: Partial<ProductNumbers> = {};
  for (const product of PRODUCTS) {
    result[product.id] = pick(product);
  }
  return result as ProductNumbers;
}

export function createInitialShop(): ShopState {
  return {
    name: SHOP_NAME,
    stock: mapProducts(() => 0),
    prices: mapProducts((product) => product.basePrice),
    lastDayRevenue: 0,
    lastDayUnits: 0,
  };
}

// Returns a number that depends on the day of the month. Payday time is busier.
export function getMonthFactor(totalDays: number): number {
  const dayOfMonth = (totalDays % DAYS_PER_MONTH) + 1;
  if (dayOfMonth >= 25) {
    return PAYDAY_END_FACTOR;
  }
  if (dayOfMonth <= 5) {
    return PAYDAY_START_FACTOR;
  }
  return MIDMONTH_FACTOR;
}

// How many customers we expect for one product on one day, before the random roll.
export function getExpectedDemand(product: ProductDef, price: number, totalDays: number): number {
  const safePrice = Math.max(price, 1);
  const priceFactor = Math.min(Math.pow(product.basePrice / safePrice, product.elasticity), PRICE_FACTOR_MAX);
  const qualityFactor = 1 + (product.quality - NEUTRAL_QUALITY) * QUALITY_DEMAND_STEP;
  return product.baseDemand * priceFactor * getMonthFactor(totalDays) * LOCATION_TRAFFIC * qualityFactor;
}

// roll is a number from 0 up to (not including) 1.
// The result is a random whole number from 0 up to about 2 times the expected demand.
export function getUnitsWanted(product: ProductDef, price: number, totalDays: number, roll: number): number {
  const expected = getExpectedDemand(product, price, totalDays);
  return Math.max(0, Math.round(roll * expected * RANDOM_MAX_FACTOR));
}

// Returns the lowest and highest price the player may set for a product.
export function getPriceLimits(product: ProductDef): { min: number; max: number } {
  return {
    min: Math.max(1, Math.round(product.basePrice * PRICE_LIMIT_LOW)),
    max: Math.max(2, Math.round(product.basePrice * PRICE_LIMIT_HIGH)),
  };
}

// Sets the price of one product. The price is rounded and kept inside the limits.
// This function does not change its input. It returns a new save.
export function setPrice(save: SaveData, productId: ProductId, newPrice: number): SaveData {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (product === undefined || !Number.isFinite(newPrice)) {
    return save;
  }
  const limits = getPriceLimits(product);
  const price = Math.min(limits.max, Math.max(limits.min, Math.round(newPrice)));
  if (price === save.shop.prices[productId]) {
    return save;
  }
  return {
    ...save,
    shop: {
      ...save.shop,
      prices: { ...save.shop.prices, [productId]: price },
    },
  };
}

// Moves the game forward by one day. This function does not change its input. It returns a new save.
export function advanceDay(save: SaveData): SaveData {
  let rngState = save.rngState;
  let revenue = 0;
  let unitsSold = 0;
  const stock: ProductNumbers = { ...save.shop.stock };

  for (const product of PRODUCTS) {
    const roll = nextRandom(rngState);
    rngState = roll.state;
    const price = save.shop.prices[product.id];
    const wanted = getUnitsWanted(product, price, save.totalDays, roll.value);
    const sold = Math.min(wanted, stock[product.id]);
    stock[product.id] = stock[product.id] - sold;
    revenue = revenue + sold * price;
    unitsSold = unitsSold + sold;
  }

  const totalDays = save.totalDays + 1;
  let cash = save.cash + revenue;
  if (totalDays % DAYS_PER_MONTH === 0) {
    cash = cash - (MONTHLY_RENT + MONTHLY_WAGES);
  }

  return {
    ...save,
    totalDays,
    cash,
    rngState,
    shop: { ...save.shop, stock, lastDayRevenue: revenue, lastDayUnits: unitsSold },
  };
}

export interface RestockResult {
  save: SaveData;
  ok: boolean;
  cost: number;
}

// Fills every product up to RESTOCK_TARGET. All or nothing.
export function restockAll(save: SaveData): RestockResult {
  let cost = 0;
  const stock: ProductNumbers = { ...save.shop.stock };
  for (const product of PRODUCTS) {
    const needed = Math.max(0, RESTOCK_TARGET - stock[product.id]);
    cost = cost + needed * product.wholesaleCost;
    stock[product.id] = stock[product.id] + needed;
  }
  if (cost === 0 || cost > save.cash) {
    return { save, ok: false, cost };
  }
  return {
    save: { ...save, cash: save.cash - cost, shop: { ...save.shop, stock } },
    ok: true,
    cost,
  };
}