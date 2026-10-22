"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAnalytics, type AnalyticsData } from "@/api/analytics";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CustomerInsights from "@/components/dashboard/CustomerInsights";
import ProductInsights from "@/components/dashboard/ProductInsights";

const currency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const requestAnalytics = useCallback(() => {
    getAnalytics().then(setAnalytics).catch((err) => { console.error("Dashboard analytics fetch failed:", err); setError(true); }).finally(() => setLoading(false));
  }, []);
  const load = useCallback(() => {
    setLoading(true); setError(false);
    requestAnalytics();
  }, [requestAnalytics]);
  useEffect(() => { requestAnalytics(); }, [requestAnalytics]);

  const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  return <main className="page-enter px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
    <div className="mx-auto max-w-[1320px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{dateLabel}</p><h1 className="mt-2 text-[28px] font-semibold tracking-[-.04em] text-white sm:text-[34px]">Your store, at a glance<span className="text-[#b6f36b]">.</span></h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#929baa]">A clear view of what’s happening across your commerce business.</p></div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-[#303846] px-3.5 py-2.5 text-xs font-medium text-[#dce1e9] hover:border-[#566174] hover:bg-white/[.03] disabled:opacity-50"><span className={loading ? "animate-spin" : ""}>↻</span> Refresh data</button>
      </div>

      {loading ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="surface h-[142px] animate-pulse bg-[#10141d]" />)}</div> : error || !analytics ? <div className="surface flex flex-col items-start gap-3 p-6"><p className="text-sm font-semibold text-white">We couldn’t reach your store data</p><p className="text-sm text-[#929baa]">Make sure the API is running, then try again.</p><button onClick={load} className="mt-1 rounded-lg bg-[#b6f36b] px-4 py-2 text-xs font-semibold text-[#11150c] hover:bg-[#c6f593]">Try again</button></div> : <>
        {(analytics.totalOrders < 5 || analytics.totalCustomers === 0 || analytics.totalProducts === 0) && <aside className="mb-4 rounded-xl border border-amber-300/20 bg-amber-300/[.05] px-4 py-3 text-xs leading-5 text-amber-100" role="status"><span className="font-semibold">Limited store history.</span> These metrics currently reflect {analytics.totalOrders.toLocaleString()} {analytics.totalOrders === 1 ? "order" : "orders"}, {analytics.totalCustomers.toLocaleString()} {analytics.totalCustomers === 1 ? "customer" : "customers"}, and {analytics.totalProducts.toLocaleString()} {analytics.totalProducts === 1 ? "product" : "products"} in MongoDB. Trends and recommendations may not represent your wider business until your real store history is connected or imported.</aside>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard title="Total revenue" value={currency(analytics.totalRevenue)} icon="$" note="From all recorded orders" />
          <KPICard title="Orders" value={analytics.totalOrders.toLocaleString()} icon="↗" note="All time" />
          <KPICard title="Customers" value={analytics.totalCustomers.toLocaleString()} icon="◎" note="In your audience" />
          <KPICard title="Average order value" value={currency(analytics.averageOrderValue)} icon="◈" note="Revenue per order" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,1fr)]">
          <RevenueChart data={analytics.revenueData} />
          <CustomerInsights customerSegments={analytics.customerSegments ?? { New: 0, Returning: 0, Loyal: 0 }} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(330px,1fr)]">
          <ProductInsights />
          <section className="surface flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-white">A useful next step</p><p className="mt-1 text-xs text-[#929baa]">Based on your current store data</p></div><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#b6f36b]/10 text-[#b6f36b]">✳</span></div>
            {analytics.recommendations?.[0] ? <div className="mt-6"><span className="rounded-full border border-[#b6f36b]/20 bg-[#b6f36b]/[.07] px-2.5 py-1 text-[10px] font-medium text-[#c6f593]">{analytics.recommendations[0].type} · {analytics.recommendations[0].priority} priority</span><h2 className="mt-4 text-xl font-semibold leading-7 tracking-tight text-white">{analytics.recommendations[0].title}</h2><p className="mt-2 text-sm leading-6 text-[#929baa]">{analytics.recommendations[0].message}</p><p className="mt-5 rounded-xl border border-[#252c38] bg-[#0b0f16] p-3 text-xs"><span className="text-[#687181]">Suggested action </span><span className="font-medium text-[#b6f36b]">{analytics.recommendations[0].action}</span></p></div> : <div className="mt-6 rounded-xl border border-dashed border-[#252c38] p-5"><p className="text-sm font-medium text-white">Your store is ready for insights</p><p className="mt-2 text-xs leading-5 text-[#929baa]">As your catalog and orders grow, recommendations will surface inventory and sales opportunities here.</p></div>}
            <Link href="/ai-insights" className="mt-auto flex items-center justify-between border-t border-[#252c38] pt-4 text-xs font-medium text-[#dce1e9] hover:text-[#b6f36b]"><span>Explore all insights</span><span>→</span></Link>
          </section>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-[#252c38] pt-4 text-[11px] text-[#687181]"><span>Meridian Commerce Intelligence</span><span>Metrics reflect all data currently recorded in your store.</span></div>
      </>}
    </div>
  </main>;
}
