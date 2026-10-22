"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnalytics, type AnalyticsData } from "@/api/analytics";

const currency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const destinations: Record<string, string> = { Inventory: "/products", Product: "/products", Sales: "/analytics", Customer: "/customers" };

export default function AIInsights() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { getAnalytics().then(setAnalytics).catch(() => setError(true)); }, []);
  const total = analytics ? Object.values(analytics.customerSegments ?? {}).reduce((sum, value) => sum + value, 0) : 0;
  const share = (value: number) => total ? Math.round(value / total * 100) : 0;

  return <div className="space-y-4">
    {error && <div className="surface p-5"><p className="text-sm font-medium text-white">Insights are unavailable</p><p className="mt-1 text-xs text-[#929baa]">Check your API connection and reload.</p></div>}
    {!analytics && !error && <div className="surface h-52 animate-pulse" />}
    {analytics && <>
      <section className="surface p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-white">Store signals</p><p className="mt-1 text-xs text-[#929baa]">Key patterns in your current commerce data</p></div><span className="rounded-full border border-[#b6f36b]/20 bg-[#b6f36b]/[.06] px-2.5 py-1 text-[10px] text-[#c6f593]">Data-led</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-[#252c38] bg-[#0b0f16] p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#687181]">Revenue</p><p className="mt-3 text-lg font-semibold text-white">{currency(analytics.totalRevenue)}</p><p className="mt-1 text-xs leading-5 text-[#929baa]">Across {analytics.totalOrders.toLocaleString()} recorded orders, with an average order value of {currency(analytics.averageOrderValue)}.</p></article>
          <article className="rounded-xl border border-[#252c38] bg-[#0b0f16] p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#687181]">Top product</p><p className="mt-3 text-lg font-semibold text-white">{analytics.bestSellingProduct?.product ?? "No leader yet"}</p><p className="mt-1 text-xs leading-5 text-[#929baa]">{analytics.bestSellingProduct?.sales ? `${analytics.bestSellingProduct.sales.toLocaleString()} units sold in recorded orders.` : "Product leaders will appear when order line items are recorded."}</p></article>
          <article className="rounded-xl border border-[#252c38] bg-[#0b0f16] p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#687181]">Customer loyalty</p><p className="mt-3 text-lg font-semibold text-white">{share(analytics.customerSegments?.Loyal ?? 0)}% <span className="text-sm font-normal text-[#929baa]">loyal</span></p><p className="mt-1 text-xs leading-5 text-[#929baa]">{(analytics.customerSegments?.Loyal ?? 0).toLocaleString()} of {total.toLocaleString()} customers are marked as loyal.</p></article>
        </div>
      </section>
      <section className="surface p-5 sm:p-6"><div><p className="text-sm font-semibold text-white">Recommended actions</p><p className="mt-1 text-xs text-[#929baa]">Suggestions generated from inventory, sales, and customer rules</p></div>
        {analytics.recommendations?.length ? <div className="mt-5 divide-y divide-[#252c38]">{analytics.recommendations.map((item, index) => <article key={`${item.type}-${item.title}-${index}`} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/[.05] px-2 py-1 text-[10px] text-[#929baa]">{item.type}</span><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${item.priority === "High" ? "bg-rose-400/10 text-rose-300" : item.priority === "Medium" ? "bg-amber-300/10 text-amber-200" : "bg-[#b6f36b]/10 text-[#c6f593]"}`}>{item.priority} priority</span></div><h2 className="text-sm font-semibold text-white">{item.title}</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-[#929baa]">{item.message}</p></div><Link href={destinations[item.type] ?? "/"} className="inline-flex shrink-0 items-center gap-2 self-start text-xs font-medium text-[#b6f36b] hover:text-[#d5ff9f] sm:self-center">{item.action}<span>→</span></Link></article>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-[#252c38] p-5"><p className="text-sm font-medium text-white">No actions to recommend yet</p><p className="mt-1 text-xs leading-5 text-[#929baa]">Add more products and order history to surface stock, sales, and retention opportunities.</p></div>}
      </section>
      <p className="px-1 text-[11px] leading-5 text-[#687181]">These recommendations use rules calculated from your store records. They are not generated by a connected language model.</p>
    </>}
  </div>;
}
