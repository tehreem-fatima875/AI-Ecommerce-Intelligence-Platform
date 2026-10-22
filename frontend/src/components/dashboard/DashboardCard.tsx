type DashboardCardProps = { title: string; description: string };

export default function DashboardCard({ title, description }: DashboardCardProps) {
  return <article className="surface p-5 transition-colors hover:border-[#3a4352] sm:p-6">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#252c38] text-sm text-[#b6f36b]">✳</span>
    <h2 className="mt-5 text-sm font-semibold text-white">{title}</h2>
    <p className="mt-2 text-xs leading-5 text-[#929baa]">{description}</p>
  </article>;
}
