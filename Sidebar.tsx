"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Package, LogIn, UserPlus, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Inventory", icon: Package },
    { id: "login", label: "Login", icon: LogIn },
    { id: "register", label: "Register", icon: UserPlus },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-white border-r border-slate-200 flex flex-col relative transition-all duration-300 ease-in-out shadow-xl z-50"
    >
      <div className="p-6 flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center">
          <Package className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl text-slate-800 tracking-tight">Warehouse OS</span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              currentView === item.id
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", currentView === item.id ? "text-blue-600" : "text-slate-400")} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
            {currentView === item.id && !isCollapsed && (
              <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-red-500 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-10 h-8 w-8 rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-50 z-[60]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
}
