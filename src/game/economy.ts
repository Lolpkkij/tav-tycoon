import type { ProductNumbers, SaveData, ShopState } from "./types";
import {
  DAYS_PER_MONTH,
  DEMAND_NOISE,
  MONTHLY_RENT,
  MONTHLY_WAGES,
  PRICE_FACTOR_MAX,
  RESTOCK_TARGET,
  SHOP_NAME,
} from "./constants";
import type { ProductDef } from "./data/products";
import { PRODUCTS } from "./data/products";
import { nextRandom } from "./rng";

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

// roll is a number from 0 up to (not including) 1.
export function getUnitsWanted(product: ProductDef, price: number, roll: number): number {
  const dayFactor = 1 - DEMAND_NOISE + roll * 2 * DEMAND_NOISE;
  const safePrice = Math.max(price, 1);
  const priceFactor = Math.min(Math.pow(product.basePrice / safePrice, product.elasticity), PRICE_FACTOR_MAX);
  return Math.max(0, Math.round(product.baseDemand * dayFactor * priceFactor));
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
    const wanted = getUnitsWanted(product, price, roll.value);
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