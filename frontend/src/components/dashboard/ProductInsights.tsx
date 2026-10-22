"use client";

import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsData } from "@/api/analytics";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ProductInsights() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { getAnalytics().then(setAnalytics).catch(() => setError(true)); }, []);

  return <section className="surface p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-sm font-semibold text-white">Product performance</p><p className="mt-1 text-xs text-[#929baa]">Units sold and current inventory</p></div>
      {analytics && <div className="text-right"><p className="text-[11px] text-[#929baa]">Products tracked</p><p className="mt-1 text-sm font-semibold text-white">{analytics.totalProducts.toLocaleString()}</p></div>}
    </div>
    {!analytics && !error ? <div className="mt-6 h-[230px] animate-pulse rounded-xl bg-white/[.03]" /> : error ? <div className="mt-6 rounded-xl border border-dashed border-[#3a2d32] p-6 text-sm text-rose-300">Product data couldn’t be loaded. Check the API connection and refresh.</div> : analytics!.productPerformance.length === 0 ? <div className="mt-6 flex h-[230px] items-center justify-center rounded-xl border border-dashed border-[#252c38] text-sm text-[#929baa]">Add products to see performance and stock levels.</div> : <>
      <div className="mt-4 h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={[...analytics!.productPerformance].sort((a, b) => b.sales - a.sales).slice(0, 7)} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#252c38" strokeDasharray="3 5" />
          <XAxis dataKey="product" tickLine={false} axisLine={false} tick={{ fill: "#929baa", fontSize: 10 }} tickMargin={12} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#687181", fontSize: 10 }} />
          <Tooltip cursor={{ fill: "#ffffff08" }} contentStyle={{ background: "#151b26", border: "1px solid #343c49", borderRadius: 10, color: "#f4f6fa", fontSize: 12 }} />
          <Bar dataKey="sales" name="Units sold" fill="#8d9bff" radius={[5, 5, 0, 0]} maxBarSize={44} />
        </BarChart></ResponsiveContainer>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[#252c38]">
        <div className="grid grid-cols-[1fr_75px_75px] gap-2 bg-white/[.025] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#687181]"><span>Product</span><span className="text-right">Sold</span><span className="text-right">In stock</span></div>
        {analytics!.productPerformance.slice(0, 5).map((product) => <div key={product.product} className="grid grid-cols-[1fr_75px_75px] gap-2 border-t border-[#252c38] px-3 py-3 text-xs"><span className="truncate text-[#dce1e9]">{product.product}</span><span className="text-right text-[#929baa]">{product.sales.toLocaleString()}</span><span className={`text-right ${product.stock <= 10 ? "text-amber-300" : "text-[#929baa]"}`}>{product.stock}{product.stock <= 10 ? " · low" : ""}</span></div>)}
      </div>
    </>}
  </section>;
}
