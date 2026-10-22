"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/components/ui/Navbar";

const icons: Record<string, string> = { "/": "◫", "/analytics": "⌁", "/customers": "◎", "/products": "▦", "/ai-insights": "✳" };

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-[232px] shrink-0 border-r border-[#252c38] px-4 py-7 md:block" aria-label="Main navigation">
      <p className="eyebrow px-3">Workspace</p>
      <nav className="mt-4 space-y-1">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium ${active ? "bg-[#b6f36b]/10 text-[#c6f593]" : "text-[#929baa] hover:bg-white/[.04] hover:text-white"}`}>
            <span className={`w-5 text-center text-base ${active ? "text-[#b6f36b]" : "text-[#687181]"}`}>{icons[item.href]}</span>{item.name}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#b6f36b]" />}
          </Link>;
        })}
      </nav>
      <div className="mt-10 rounded-xl border border-[#252c38] bg-[#10141d] p-4">
        <p className="text-xs font-medium text-white">Your store at a glance</p>
        <p className="mt-1.5 text-xs leading-5 text-[#929baa]">One workspace for sales, customers, and inventory decisions.</p>
        <div className="mt-4 text-[11px] text-[#b6f36b]">STORE ANALYTICS</div>
      </div>
      <div className="mt-auto px-3 pt-8 text-[11px] text-[#687181]">MERIDIAN · STORE INTELLIGENCE</div>
    </aside>
  );
}
