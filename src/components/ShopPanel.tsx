import type { ProductId, ShopState } from "../game/types";
import { PRODUCTS } from "../game/data/products";
import { DELIVERY_FEE, MONTHLY_RENT, MONTHLY_WAGES, RESTOCK_TARGET } from "../game/constants";
import { formatCash } from "../game/dateUtils";
import { getPriceLimits, getRestockCost } from "../game/economy";
import { CARD, PRIMARY_BUTTON } from "./styles";

interface ShopPanelProps {
  shop: ShopState;
  onRestock: () => void;
  onRestockOne: (productId: ProductId) => void;
  onPriceChange: (productId: ProductId, newPrice: number) => void;
}

const STEP_BUTTON =
  "h-10 w-10 rounded-lg bg-white/10 text-lg font-bold hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40";

const RESTOCK_BUTTON =
  "h-10 rounded-lg bg-white/10 px-3 text-sm font-semibold hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40";

export default function ShopPanel({ shop, onRestock, onRestockOne, onPriceChange }: ShopPanelProps) {
  return (
    <section className={CARD + " w-full max-w-2xl"}>
      <h2 className="text-xl font-bold">{shop.name}</h2>
      <p className="mt-1 text-sm text-white/70">
        Yesterday: {formatCash(shop.lastDayRevenue)} from {shop.lastDayUnits} items sold.
      </p>
      <p className="text-sm text-white/70">
        Rent and wages: {formatCash(MONTHLY_RENT + MONTHLY_WAGES)} every 30 days.
      </p>
      <p className="text-sm text-white/70">
        Delivery fee: {formatCash(DELIVERY_FEE)} for each delivery. &quot;Restock all&quot; is one delivery.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {PRODUCTS.map((product) => {
          const price = shop.prices[product.id];
          const stock = shop.stock[product.id];
          const limits = getPriceLimits(product);
          const profit = price - product.wholesaleCost;
          const goodsCost = getRestockCost(product, stock);
          const isFull = goodsCost === 0;
          return (
            <li key={product.id} className="flex flex-col gap-2 rounded-lg bg-white/5 px-3 py-2">
              <span className="text-base font-semibold">
                {product.name}{" "}
                <span className="text-sm font-normal text-white/70">({product.unitLabel})</span>
              </span>
              <span className="text-sm text-white/80">
                Stock {stock} | Cost {formatCash(product.wholesaleCost)} | Profit{' '}
                <span className={profit >= 0 ? "text-green-400" : "text-red-400"}>
                  {profit >= 0 ? "+" : ""}
                  {profit}
                </span>{' '}
                each
              </span>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={STEP_BUTTON}
                    aria-label={"Lower the price of " + product.name}
                    disabled={price <= limits.min}
                    onClick={() => onPriceChange(product.id, price - 1)}
                  >
                    -
                  </button>
                  <span className="min-w-[5rem] text-center text-base font-semibold">
                    {formatCash(price)}
                  </span>
                  <button
                    type="button"
                    className={STEP_BUTTON}
                    aria-label={"Raise the price of " + product.name}
                    disabled={price >= limits.max}
                    onClick={() => onPriceChange(product.id, price + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className={RESTOCK_BUTTON}
                  aria-label={"Restock " + product.name}
                  disabled={isFull}
                  onClick={() => onRestockOne(product.id)}
                >
                  {isFull ? "Full" : "Restock " + formatCash(goodsCost + DELIVERY_FEE)}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <button type="button" className={PRIMARY_BUTTON + " mt-4 w-full"} onClick={onRestock}>
        Restock all to {RESTOCK_TARGET} (one delivery)
      </button>
    </section>
  );
}
