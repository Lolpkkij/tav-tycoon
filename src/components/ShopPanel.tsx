import type { ShopState } from "../game/types";
import { PRODUCTS } from "../game/data/products";
import { MONTHLY_RENT, MONTHLY_WAGES, RESTOCK_TARGET } from "../game/constants";
import { formatCash } from "../game/dateUtils";
import { CARD, PRIMARY_BUTTON } from "./styles";

interface ShopPanelProps {
  shop: ShopState;
  onRestock: () => void;
}

export default function ShopPanel({ shop, onRestock }: ShopPanelProps) {
  return (
    <section className={CARD + " w-full max-w-2xl"}>
      <h2 className="text-xl font-bold">{shop.name}</h2>
      <p className="mt-1 text-sm text-white/70">
        Yesterday: {formatCash(shop.lastDayRevenue)} from {shop.lastDayUnits} items sold.
      </p>
      <p className="text-sm text-white/70">
        Rent and wages: {formatCash(MONTHLY_RENT + MONTHLY_WAGES)} every 30 days.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {PRODUCTS.map((product) => (
          <li
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg bg-white/5 px-3 py-2"
          >
            <span className="text-base font-semibold">
              {product.name}{" "}
              <span className="text-sm font-normal text-white/70">({product.unitLabel})</span>
            </span>
            <span className="text-sm text-white/80">
              Stock {shop.stock[product.id]} | Cost {formatCash(product.wholesaleCost)} | Price{" "}
              {formatCash(shop.prices[product.id])}
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className={PRIMARY_BUTTON + " mt-4 w-full"} onClick={onRestock}>
        Restock all to {RESTOCK_TARGET}
      </button>
    </section>
  );
}