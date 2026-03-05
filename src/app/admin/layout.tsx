"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Ship,
  ClipboardList,
  LogOut,
  Anchor,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Fleet", href: "/admin/fleet", icon: Ship },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("yousef_admin_auth");
    if (auth !== "true" && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setAuthenticated(auth === "true" || pathname === "/admin/login");
    }
  }, [pathname, router]);

  function handleLogout() {
    localStorage.removeItem("yousef_admin_auth");
    router.replace("/admin/login");
  }

  // Login page renders without the admin chrome
  if (pathname === "/admin/login") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a1628]">{children}</div>
    );
  }

  if (authenticated === null) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#006DB0] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#0a1628] text-gray-100">
      {/* Sidebar */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#060f1f]">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <Anchor className="h-7 w-7 text-[#006DB0]" />
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Yousef Yachts
            </span>
            <span className="ml-2 rounded bg-[#006DB0]/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#006DB0]">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#006DB0]/15 text-[#006DB0]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-8">
          <h1 className="text-lg font-semibold text-white">
            {NAV_ITEMS.find(
              (item) =>
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))
            )?.label ?? "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#006DB0]/30 flex items-center justify-center text-sm font-bold text-[#006DB0]">
              A
            </div>
            <span className="text-sm text-gray-300">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
