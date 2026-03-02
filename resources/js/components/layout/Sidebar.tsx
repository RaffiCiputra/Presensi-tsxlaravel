import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Settings, 
  FileText,
  Clock,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../ui/utils";
import { Calendar } from "lucide-react";


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
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Clock className="size-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Admin Page</span>
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )
                  }
                >
                  <Icon className="size-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 transition-colors">
              <LogOut className="size-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}