"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Target, Wallet } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Budgets", href: "/budgets", icon: Target },
    { label: "Accounts", href: "/accounts", icon: Wallet },
  ];

  return (
    <nav className="flex items-center space-x-1 bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-[var(--glassmorphism-border)] w-fit">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
              isActive
                ? "bg-[var(--glassmorphism-primary)] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-100 hover:text-[var(--glassmorphism-primary)]"
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
