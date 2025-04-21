import { useNavigate } from "react-router-dom";
import { Home, Users, DollarSign, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export function MobileNavigation() {
  const navigate = useNavigate();
  const { currentGroupId } = useApp();
  
  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      active: window.location.pathname === "/"
    },
    {
      label: "Group",
      icon: Users,
      href: currentGroupId ? `/groups/${currentGroupId}` : "/",
      active: window.location.pathname.includes("/groups/")
    },
    {
      label: "Expenses",
      icon: DollarSign,
      href: currentGroupId ? `/groups/${currentGroupId}/expenses/add` : "/",
      active: window.location.pathname.includes("/expenses/add")
    },
    {
      label: "Balances",
      icon: PieChart,
      href: currentGroupId ? `/groups/${currentGroupId}/balances` : "/",
      active: window.location.pathname.includes("/balances")
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: window.location.pathname === "/settings"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-md mx-auto bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className={cn(
                "py-3 flex flex-col items-center justify-center flex-1",
                item.active ? "text-expense" : "text-gray-500"
              )}
              disabled={item.label !== "Home" && item.label !== "Settings" && !currentGroupId}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
