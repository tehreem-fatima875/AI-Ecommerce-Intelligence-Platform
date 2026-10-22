"use client";

import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsData } from "@/api/analytics";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { getAnalytics().then(setAnalytics).catch(() => setError(true)); }, []);
  const bestMonth = analytics?.revenueData.reduce((best, month) => month.revenue > (best?.revenue ?? -1) ? month : best, undefined as { month: string; revenue: number } | undefined);

  return <main className="page-enter px-4 py-7 sm:px-6 sm:py-9 lg:px-10"><div className="mx-auto max-w-[1320px]">
    <div className="mb-8"><p className="eyebrow">Performance</p><h1 className="mt-2 text-[28px] font-semibold tracking-[-.04em] text-white sm:text-[34px]">Sales analytics<span className="text-[#b6f36b]">.</span></h1><p className="mt-2 text-sm text-[#929baa]">Track revenue and order activity across the data recorded in your store.</p></div>
    {!analytics && !error ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="surface h-[140px] animate-pulse" />)}</div> : error || !analytics ? <div className="surface p-6"><p className="text-sm font-semibold text-white">Analytics are unavailable</p><p className="mt-2 text-sm text-[#929baa]">Check the API connection and reload this page.</p></div> : <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><KPICard title="Revenue" value={money(analytics.totalRevenue)} icon="$" note="All recorded orders" /><KPICard title="Orders" value={analytics.totalOrders.toLocaleString()} icon="↗" note="All time" /><KPICard title="Average order value" value={money(analytics.averageOrderValue)} icon="◈" note="Revenue per order" /><KPICard title="Best month" value={bestMonth?.month ?? "—"} icon="✳" note={bestMonth ? `${money(bestMonth.revenue)} revenue` : "No monthly data yet"} /></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,.8fr)]"><RevenueChart data={analytics.revenueData} />
        <section className="surface p-5 sm:p-6"><p className="text-sm font-semibold text-white">Sales context</p><p className="mt-1 text-xs text-[#929baa]">Supporting metrics for your store</p><div className="mt-5 divide-y divide-[#252c38]">
          <div className="flex items-center justify-between gap-4 py-4"><span className="text-xs text-[#929baa]">Products in catalog</span><span className="text-sm font-semibold text-white">{analytics.totalProducts.toLocaleString()}</span></div>
          <div className="flex items-center justify-between gap-4 py-4"><span className="text-xs text-[#929baa]">Customers</span><span className="text-sm font-semibold text-white">{analytics.totalCustomers.toLocaleString()}</span></div>
          <div className="flex items-center justify-between gap-4 py-4"><span className="text-xs text-[#929baa]">Leading product</span><span className="max-w-[150px] truncate text-right text-xs font-medium text-white">{analytics.bestSellingProduct?.product ?? "No sales yet"}</span></div>
          <div className="flex items-center justify-between gap-4 py-4"><span className="text-xs text-[#929baa]">Units sold by leader</span><span className="text-sm font-semibold text-white">{analytics.bestSellingProduct?.sales.toLocaleString() ?? "—"}</span></div>
        </div><p className="mt-3 rounded-lg bg-white/[.025] p-3 text-[10px] leading-5 text-[#687181]">Monthly revenue is grouped from order dates. Add more order history to build a richer trend.</p></section>
      </div>
      <section className="surface mt-4 overflow-hidden"><div className="border-b border-[#252c38] p-4 sm:px-5"><h2 className="text-sm font-semibold text-white">Monthly revenue</h2><p className="mt-1 text-xs text-[#929baa]">{analytics.revenueData.length} months represented in your recorded orders</p></div><div className="overflow-x-auto"><table className="w-full min-w-[360px] text-left"><thead><tr className="bg-white/[.025] text-[10px] uppercase tracking-wider text-[#687181]"><th className="px-5 py-3 font-semibold">Month</th><th className="px-5 py-3 text-right font-semibold">Revenue</th><th className="px-5 py-3 text-right font-semibold">Share of total</th></tr></thead><tbody>{analytics.revenueData.map((item, index) => <tr key={`${item.month}-${index}`} className="border-t border-[#252c38] text-xs"><td className="px-5 py-3.5 font-medium text-[#dce1e9]">{item.month}</td><td className="px-5 py-3.5 text-right text-[#dce1e9]">{money(item.revenue)}</td><td className="px-5 py-3.5 text-right text-[#929baa]">{analytics.totalRevenue ? `${(item.revenue / analytics.totalRevenue * 100).toFixed(1)}%` : "—"}</td></tr>)}{analytics.revenueData.length === 0 && <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-[#929baa]">No order history yet. Monthly totals will appear here when the first order is recorded.</td></tr>}</tbody></table></div></section>
      <p className="mt-4 text-[11px] text-[#687181]">Figures reflect all orders currently stored in your database. Month labels do not include a year in the source data.</p>
    </>}
  </div></main>;
}
