import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian — Commerce intelligence",
  description: "A clear view of revenue, customers, products, and the next best action for your store.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[1600px]">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
