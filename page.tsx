"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProductDashboard from "@/components/ProductDashboard";
import AuditLogs from "@/components/AuditLogs";
import Login from "@/components/Auth/Login";
import Register from "@/components/Auth/Register";
import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [currentView, setCurrentView] = useState("dashboard");
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const handleLogout = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return (
      <AnimatePresence mode="wait">
        {authView === "login" ? (
          <Login 
            key="login"
            onRegisterClick={() => setAuthView("register")} 
            onLoginSuccess={() => setCurrentView("dashboard")}
          />
        ) : (
          <Register 
            key="register"
            onLoginClick={() => setAuthView("login")} 
            onRegisterSuccess={() => setAuthView("login")}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          if (view === "login") handleLogout();
          else setCurrentView(view);
        }} 
      />
      <main className="flex-1 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentView === "dashboard" ? (
              <div className="p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                  <p className="text-slate-500">Real-time telemetry and warehouse performance indicators.</p>
                </div>
                <ProductDashboard showOnlyStats={true} />
              </div>
            ) : currentView === "inventory" ? (
              <div className="p-8">
                <ProductDashboard showOnlyTable={true} />
              </div>
            ) : (
              <div className="p-8">
                <AuditLogs />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
