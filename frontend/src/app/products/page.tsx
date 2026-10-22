"use client";

import { useEffect, useMemo, useState } from "react";
import { getAnalytics, getProducts, type AnalyticsData, type ProductRecord } from "@/api/analytics";

type ProductRow = ProductRecord & { sold: number };
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  useEffect(() => {
    Promise.all([getProducts(), getAnalytics()]).then(([records, analytics]: [ProductRecord[], AnalyticsData]) => {
      const sales = new Map(analytics.productPerformance.map((item) => [item.product, item.sales]));
      setProducts(records.map((item) => ({ ...item, sold: sales.get(item.name) ?? 0 })));
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);
  const lowCount = products.filter((item) => item.stock <= 10).length;
  const filtered = useMemo(() => products.filter((product) => {
    const matches = `${product.name} ${product.category ?? ""}`.toLowerCase().includes(query.toLowerCase());
    return matches && (stockFilter === "all" || (stockFilter === "low" ? product.stock <= 10 : product.stock > 10));
  }), [products, query, stockFilter]);

  return <main className="page-enter px-4 py-7 sm:px-6 sm:py-9 lg:px-10"><div className="mx-auto max-w-[1320px]">
    <div className="mb-8"><p className="eyebrow">Catalog</p><h1 className="mt-2 text-[28px] font-semibold tracking-[-.04em] text-white sm:text-[34px]">Product intelligence<span className="text-[#b6f36b]">.</span></h1><p className="mt-2 text-sm text-[#929baa]">Understand what sells, what’s in stock, and where attention is needed.</p></div>
    {loading ? <div className="surface h-64 animate-pulse" /> : error ? <div className="surface p-6"><p className="text-sm font-semibold text-white">Product data is unavailable</p><p className="mt-2 text-sm text-[#929baa]">Check that the API is running and reload this page.</p></div> : <>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="surface p-4"><p className="text-xs text-[#929baa]">Catalog items</p><p className="mt-2 text-2xl font-semibold tracking-tight text-white">{products.length}</p></div>
        <div className="surface p-4"><p className="text-xs text-[#929baa]">Low stock · 10 or fewer</p><p className={`mt-2 text-2xl font-semibold tracking-tight ${lowCount ? "text-amber-300" : "text-white"}`}>{lowCount}</p></div>
        <div className="surface col-span-2 p-4 lg:col-span-1"><p className="text-xs text-[#929baa]">Units sold</p><p className="mt-2 text-2xl font-semibold tracking-tight text-white">{products.reduce((sum, item) => sum + item.sold, 0).toLocaleString()}</p></div>
      </div>
      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#252c38] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><h2 className="text-sm font-semibold text-white">All products</h2><p className="mt-1 text-xs text-[#929baa]">{filtered.length} of {products.length} items</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="product-search">Search products</label><input id="product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" className="h-10 min-w-0 rounded-lg border border-[#303846] bg-[#0b0f16] px-3 text-xs text-white placeholder:text-[#687181] focus:border-[#b6f36b]/50 focus:outline-none sm:w-56" />
            <label className="sr-only" htmlFor="stock-filter">Filter by stock</label><select id="stock-filter" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="h-10 rounded-lg border border-[#303846] bg-[#0b0f16] px-3 text-xs text-[#dce1e9] focus:border-[#b6f36b]/50 focus:outline-none"><option value="all">All stock levels</option><option value="low">Low stock</option><option value="healthy">In stock</option></select>
          </div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left">
          <thead><tr className="bg-white/[.025] text-[10px] font-semibold uppercase tracking-wider text-[#687181]"><th className="px-5 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Units sold</th><th className="px-5 py-3 text-right">Inventory</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item._id} className="border-t border-[#252c38] text-xs hover:bg-white/[.02]"><td className="px-5 py-4"><p className="font-medium text-[#e9edf4]">{item.name}</p>{item.description && <p className="mt-1 max-w-xs truncate text-[10px] text-[#687181]">{item.description}</p>}</td><td className="px-4 py-4 text-[#929baa]">{item.category || "Uncategorized"}</td><td className="px-4 py-4 text-right text-[#dce1e9]">{money(item.price)}</td><td className="px-4 py-4 text-right text-[#929baa]">{item.sold.toLocaleString()}</td><td className="px-5 py-4 text-right"><span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${item.stock <= 10 ? "bg-amber-400/10 text-amber-300" : "bg-[#b6f36b]/[.08] text-[#c6f593]"}`}>{item.stock} {item.stock <= 10 ? "· Low" : "· In stock"}</span></td></tr>)}
          {filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-[#929baa]">{products.length ? "No products match those filters." : "Your catalog is empty. Products will appear here when added to your store."}</td></tr>}</tbody>
        </table></div>
      </section>
      <p className="mt-4 text-[11px] text-[#687181]">Sales totals are calculated from recorded order line items. Low stock is defined as 10 units or fewer.</p>
    </>}
  </div></main>;
}
