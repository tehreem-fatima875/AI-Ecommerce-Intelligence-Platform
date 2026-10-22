"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type RevenueChartProps = { data: { month: string; revenue: number }[]; compact?: boolean };

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function RevenueChart({ data, compact = false }: RevenueChartProps) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const average = data.length ? total / data.length : 0;
  return (
    <section className="surface min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Revenue over time</p>
          <p className="mt-1 text-xs text-[#929baa]">Monthly sales from recorded orders</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[#929baa]">Period average</p>
          <p className="mt-1 text-sm font-semibold text-white">{money(average)}</p>
        </div>
      </div>
      {data.length === 0 ? <div className="mt-6 flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#252c38] text-center">
        <span className="text-2xl text-[#687181]">⌁</span><p className="mt-3 text-sm text-white">No revenue history yet</p><p className="mt-1 text-xs text-[#929baa]">Once orders are recorded, your monthly trend will appear here.</p>
      </div> : <div className={`mt-5 w-full ${compact ? "h-[250px]" : "h-[320px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b6f36b" stopOpacity={0.2} /><stop offset="95%" stopColor="#b6f36b" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="#252c38" strokeDasharray="3 5" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#929baa", fontSize: 11 }} tickMargin={12} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#687181", fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : `$${value}`} />
            <Tooltip contentStyle={{ background: "#151b26", border: "1px solid #343c49", borderRadius: 10, color: "#f4f6fa", fontSize: 12 }} formatter={(value) => [money(Number(value ?? 0)), "Revenue"]} labelStyle={{ color: "#929baa", marginBottom: 4 }} />
            <Area type="monotone" dataKey="revenue" stroke="#b6f36b" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, fill: "#b6f36b", stroke: "#10141d", strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>}
    </section>
  );
}
