"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { name: "Overview", href: "/" },
  { name: "Analytics", href: "/analytics" },
  { name: "Customers", href: "/customers" },
  { name: "Products", href: "/products" },
  { name: "Insights", href: "/ai-insights" },
];

export { items as navigationItems };

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#252c38] bg-[#090c12]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Meridian home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b6f36b] text-lg font-black text-[#11150c]">m</span>
          <span>
            <span className="block text-[15px] font-semibold tracking-tight text-white">meridian<span className="text-[#b6f36b]">.</span></span>
            <span className="hidden text-[10px] tracking-[.12em] text-[#929baa] sm:block">COMMERCE INTELLIGENCE</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b6f36b]" />
          <span className="text-xs text-[#929baa]">Commerce workspace</span>
        </div>

        <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-[#252c38] px-3 py-2 text-sm text-white sm:hidden" aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
      {menuOpen && <nav className="border-t border-[#252c38] px-4 py-3 sm:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined} className={`rounded-lg px-3 py-2.5 text-sm ${pathname === item.href ? "bg-[#b6f36b]/10 text-[#b6f36b]" : "text-[#929baa] hover:bg-white/5 hover:text-white"}`}>{item.name}</Link>)}
        </div>
      </nav>}
    </header>
  );
}
