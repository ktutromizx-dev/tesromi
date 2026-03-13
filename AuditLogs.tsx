"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, TrendingUp, TrendingDown, Clock, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InventoryLog {
  id: string;
  productId: string;
  changeAmount: number;
  note: string | null;
  createdAt: string;
  product?: {
    name: string;
    category: string;
  };
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/inventory-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Audit Trail
          </h2>
          <p className="text-slate-500">Chronological history of all stock movements.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Timestamp</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Product</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Activity</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Quantity</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{log.product?.name || "Deleted Product"}</div>
                            <div className="text-xs text-slate-500">{log.product?.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${log.changeAmount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"} border-none shadow-none`}>
                          {log.changeAmount > 0 ? "Stock Added" : "Stock Reduced"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 font-bold ${log.changeAmount > 0 ? "text-emerald-600" : "text-orange-600"}`}>
                          {log.changeAmount > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {log.changeAmount > 0 ? "+" : ""}{log.changeAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 italic text-sm">{log.note || "-"}</span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
