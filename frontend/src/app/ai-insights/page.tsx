import AIInsights from "@/components/dashboard/AIInsights";

export default function AIInsightsPage() {
  return <main className="page-enter px-4 py-7 sm:px-6 sm:py-9 lg:px-10"><div className="mx-auto max-w-[1320px]">
    <div className="mb-8"><p className="eyebrow">Decision support</p><h1 className="mt-2 text-[28px] font-semibold tracking-[-.04em] text-white sm:text-[34px]">Insights & recommendations<span className="text-[#b6f36b]">.</span></h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#929baa]">Turn your sales, catalog, and customer data into practical next steps.</p></div>
    <AIInsights />
  </div></main>;
}
