type SalesSummaryProps = { orders: number; averageOrderValue: number };
const currency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

export default function SalesSummary({ orders, averageOrderValue }: SalesSummaryProps) {
  return <section className="surface p-5 sm:p-6">
    <div><p className="text-sm font-semibold text-white">Order snapshot</p><p className="mt-1 text-xs text-[#929baa]">Sales activity across your recorded orders</p></div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-[#252c38] bg-[#0b0f16] p-4"><p className="text-xs text-[#929baa]">Orders</p><p className="mt-2 text-xl font-semibold text-white">{orders.toLocaleString()}</p></div>
      <div className="rounded-xl border border-[#252c38] bg-[#0b0f16] p-4"><p className="text-xs text-[#929baa]">Average order value</p><p className="mt-2 text-xl font-semibold text-white">{currency(averageOrderValue)}</p></div>
    </div>
  </section>;
}
