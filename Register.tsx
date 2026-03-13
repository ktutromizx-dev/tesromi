"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Register({ onLoginClick, onRegisterSuccess }: { onLoginClick: () => void, onRegisterSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });

        if (error) {
            toast.error(error.message || "Failed to create account");
        } else {
            toast.success("Account created! Please sign in.");
            onRegisterSuccess();
        }
    } catch (err) {
        toast.error("An unexpected error occurred");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-10 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 z-10"
      >
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
              <UserPlus className="text-white w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create Account</CardTitle>
            <CardDescription className="text-slate-500 text-lg">
              Join Warehouse OS today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 bg-white/50 border-slate-200 focus:bg-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-white/50 border-slate-200 focus:bg-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-white/50 border-slate-200 focus:bg-white" 
                />
              </div>
            </div>
            <Button 
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25 gap-2"
            >
              {isLoading ? "Creating Account..." : "Get Started"} <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Already registered?</span></div>
            </div>
            <div className="text-center text-sm text-slate-500">
              <button 
                onClick={onLoginClick}
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
              >
                Sign in to account
              </button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
