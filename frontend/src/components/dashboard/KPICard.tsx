type KPICardProps = { title: string; value: string; change?: string; positive?: boolean; icon?: string; note?: string };

export default function KPICard({ title, value, change, positive = true, icon = "↗", note }: KPICardProps) {
  return (
    <article className="surface group p-5 transition-colors hover:border-[#3a4352] sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[#929baa]">{title}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#252c38] text-sm text-[#b6f36b]">{icon}</span>
      </div>
      <p className="mt-5 truncate text-[28px] font-semibold tracking-[-.04em] text-white sm:text-[32px]">{value}</p>
      <div className="mt-2 flex min-h-5 items-center gap-2 text-xs">
        {change && <span className={positive ? "font-medium text-[#b6f36b]" : "font-medium text-rose-400"}>{change}</span>}
        <span className="text-[#687181]">{note ?? (change ? "vs. previous period" : "Across all recorded data")}</span>
      </div>
    </article>
  );
}
