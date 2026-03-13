"use client";

import { useState, useEffect } from "react";
import { Product, ProductCategory } from "@/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Package, TrendingDown, DollarSign, Percent, AlertCircle } from "lucide-react";

interface ProductDashboardProps {
  showOnlyStats?: boolean;
  showOnlyTable?: boolean;
}

export default function ProductDashboard({ showOnlyStats, showOnlyTable }: ProductDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Laptop");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setStock(product.stock);
    } else {
      setEditingId(null);
      setName("");
      setCategory("Laptop");
      setPrice("");
      setStock("");
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name || price === "" || stock === "") {
      toast.error("Please fill in all fields.");
      return;
    }

    const priceNum = Number(price);
    const productData = { name, category, price: priceNum, stock: Number(stock) };

    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          toast.success("Product updated successfully!");
          fetchProducts();
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          toast.success("Product added successfully!");
          fetchProducts();
        }
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("An error occurred while saving.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted.");
        fetchProducts();
      }
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const handleBulkRestock = async () => {
    try {
      const res = await fetch("/api/products/bulk-restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10 }),
      });
      if (res.ok) {
        toast.success("Bulk restock: Added 10 units to all products.");
        fetchProducts();
      } else {
        throw new Error("Bulk restock failed");
      }
    } catch (error) {
      toast.error("Failed to perform bulk restock.");
    }
  };

  const stats = {
    totalValue: products.reduce((acc, p) => acc + p.price * p.stock, 0),
    totalStock: products.reduce((acc, p) => acc + p.stock, 0),
    avgDiscount: products.length ? products.reduce((acc, p) => acc + p.discount, 0) / products.length : 0,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Smart Warehouse
          </h1>
          <p className="text-slate-500 mt-1">Manage your electronics inventory with ease.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-slate-200" onClick={handleBulkRestock}>
            <Package className="w-4 h-4" /> Bulk Restock
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </header>

      {!showOnlyTable && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Total Asset Value", value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50", gradient: "from-blue-50 to-indigo-50" },
            { label: "Inventory Volume", value: stats.totalStock, icon: Package, color: "text-purple-600", bg: "bg-purple-50", gradient: "from-purple-50 to-fuchsia-50" },
            { label: "Avg. Discount Rate", value: `${stats.avgDiscount.toFixed(1)}%`, icon: TrendingDown, color: "text-emerald-600", bg: "bg-emerald-50", gradient: "from-emerald-50 to-teal-50" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-8 rounded-3xl bg-gradient-to-br ${item.gradient} border border-white/50 shadow-xl transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center blur-sm" />
                </div>
                <p className="text-slate-500 font-semibold mb-1 uppercase tracking-widest text-[10px]">{item.label}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{item.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!showOnlyStats && (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">Inventory Management</h3>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="col-span-3" 
                      placeholder="e.g. ThinkPad X1"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <div className="col-span-3">
                      <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Smartphone">Smartphone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price ($)</Label>
                    <Input 
                      id="price" 
                      type="number"
                      value={price} 
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">Stock</Label>
                    <Input 
                      id="stock" 
                      type="number"
                      value={stock} 
                      onChange={(e) => setStock(e.target.value ? Number(e.target.value) : "")} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-slate-400">
                      No products found in the warehouse.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const totalPrice = product.price + product.tax - product.discount;
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-orange-600 shadow-sm border border-orange-100/50">
                              {product.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{product.name}</p>
                              {product.stock < 5 && (
                                <Badge className="bg-red-500 text-white border-none h-4 px-1.5 text-[8px] uppercase tracking-tighter">Urgent Restock</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={product.category === "Laptop" 
                              ? "bg-blue-100/50 text-blue-700 border-blue-200/50 px-3 py-1" 
                              : "bg-purple-100/50 text-purple-700 border-purple-200/50 px-3 py-1"}
                          >
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-700">${product.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-red-500/80 font-medium">
                          +{product.tax.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-emerald-600 font-medium">
                          -{product.discount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm font-black text-slate-950">${totalPrice.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">Total</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                             <span className={`text-sm font-black ${
                              product.stock < 5 ? "text-red-500 animate-pulse" : "text-slate-900"
                            }`}>
                              {product.stock}
                            </span>
                            {product.stock < 5 && <AlertCircle className="w-4 h-4 text-red-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600" onClick={() => handleOpenDialog(product)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </Card>
      )}
      <footer className="text-center text-slate-400 text-sm py-4">
        &copy; 2026 Smart Warehouse Management System
      </footer>
    </div>
  );
}
