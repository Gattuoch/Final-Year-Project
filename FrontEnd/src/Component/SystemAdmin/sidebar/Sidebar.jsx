import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Shield,
  Database,
  HardDrive,
  FileText,
  Bell,
  Sparkles,
  Settings,
  DollarSign,
  Tent,
  Users
} from "lucide-react";
import { cn } from "../ui/utils";
import { useLanguage } from "../../../context/LanguageContext";

const navItems = [
  { path: "/super-admin", label: "Dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { path: "/super-admin/security", label: "Security", labelKey: "security", icon: Shield },
  { path: "/super-admin/database", label: "Database", labelKey: "database", icon: Database },
  { path: "/super-admin/backup", label: "Backup & Recovery", labelKey: "backup", icon: HardDrive },
  { path: "/super-admin/logs", label: "Logs & Monitoring", labelKey: "logs", icon: FileText },
  { path: "/super-admin/reports", label: "Reports & Alerts", labelKey: "reports", icon: Bell },
  { path: "/super-admin/features", label: "Feature Management", labelKey: "features", icon: Sparkles },
  { path: "/super-admin/configuration", label: "Configuration", labelKey: "configuration", icon: Settings },
  { path: "/super-admin/financial", label: "Financial", labelKey: "financial", icon: DollarSign },
  { path: "/super-admin/camps", label: "Camp Management", labelKey: "campManagement", icon: Tent },
  { path: "/super-admin/users", labelKey: "userManagement", icon: Users },
];

function Sidebar({ sidebarOpen }) {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className={cn(
      "fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto z-10",
      sidebarOpen ? "w-64" : "w-0"
    )}>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/super-admin"
            ? location.pathname === "/super-admin"
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-green-50 text-green-700 font-semibold shadow-sm ring-1 ring-green-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >

              <Icon className="w-5 h-5" />
              <span className="whitespace-nowrap">{t(`sidebar.${item.labelKey}`) || item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;