"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type CustomerInsightsProps = { customerSegments: { New: number; Returning: number; Loyal: number } };
const segments = [{ key: "New" as const, label: "New customers", color: "#8d9bff" }, { key: "Returning" as const, label: "Returning", color: "#55d6be" }, { key: "Loyal" as const, label: "Loyal", color: "#b6f36b" }];

export default function CustomerInsights({ customerSegments }: CustomerInsightsProps) {
  const total = segments.reduce((sum, item) => sum + (customerSegments?.[item.key] ?? 0), 0);
  const chartData = segments.map(({ key, label }) => ({ segment: label, customers: customerSegments?.[key] ?? 0 }));
  return <section className="surface p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-sm font-semibold text-white">Customer mix</p><p className="mt-1 text-xs text-[#929baa]">Audience breakdown by relationship</p></div>
      <div className="text-right"><p className="text-[11px] text-[#929baa]">Total audience</p><p className="mt-1 text-sm font-semibold text-white">{total.toLocaleString()}</p></div>
    </div>
    {total === 0 ? <div className="mt-6 flex h-[230px] items-center justify-center rounded-xl border border-dashed border-[#252c38] text-sm text-[#929baa]">Customer segments will show as your audience grows.</div> : <>
      <div className="mt-4 h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 8, right: 2, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#252c38" strokeDasharray="3 5" />
          <XAxis dataKey="segment" tickLine={false} axisLine={false} tick={{ fill: "#929baa", fontSize: 10 }} tickMargin={12} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#687181", fontSize: 10 }} />
          <Tooltip cursor={{ fill: "#ffffff08" }} contentStyle={{ background: "#151b26", border: "1px solid #343c49", borderRadius: 10, color: "#f4f6fa", fontSize: 12 }} />
          <Bar dataKey="customers" fill="#b6f36b" radius={[5, 5, 0, 0]} maxBarSize={44} />
        </BarChart></ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#252c38] pt-4">
        {segments.map((item) => { const count = customerSegments?.[item.key] ?? 0; const share = total ? Math.round(count / total * 100) : 0; return <div key={item.key}>
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="truncate text-[10px] text-[#929baa] sm:text-xs">{item.key}</span></div>
          <p className="mt-1.5 text-sm font-semibold text-white">{count.toLocaleString()} <span className="text-[10px] font-normal text-[#687181]">{share}%</span></p>
        </div>; })}
      </div>
    </>}
  </section>;
}
