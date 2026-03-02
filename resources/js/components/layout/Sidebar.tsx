import {
  LayoutDashboard,
  Users,
  DollarSign,
  Settings,
  FileText,
  Clock,
  LogOut,
  Calendar,
} from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../ui/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Riwayat Absen", href: "/admin/attendance", icon: Clock },
  { name: "Staff", href: "/admin/users", icon: Users },
  { name: "Alur Kas", href: "/admin/cash-flow", icon: DollarSign },
  { name: "Kalender Event", href: "/admin/kalender", icon: Calendar },
  { name: "Laporan", href: "/admin/reports", icon: FileText },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                <Clock className="size-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">
                Admin Page
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all",
                      "hover:bg-gray-100 hover:text-gray-900 hover:shadow-[0_1px_4px_rgba(15,23,42,0.08)]",
                      isActive &&
                        "bg-blue-50 text-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.25)] border border-blue-100"
                    )
                  }
                  onClick={onClose}
                >
                  <Icon className="size-5 text-gray-400 group-hover:text-gray-600 group-[.active]:text-blue-600" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4 bg-white/80">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
              <LogOut className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
