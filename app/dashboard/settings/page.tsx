"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // დროებითი ფუნქციები
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("პროფილი განახლდა");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("პაროლი შეიცვალა");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>იტვირთება...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950">
          <h1 className="text-4xl font-bold mb-6">პარამეტრები</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>პროფილის განახლება</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">სახელი</Label>
                    <Input id="name" type="text" placeholder="თქვენი სახელი" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ელფოსტა</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                    />
                  </div>
                  <Button type="submit">შენახვა</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>პაროლის შეცვლა</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">მიმდინარე პაროლი</Label>
                    <Input id="current-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">ახალი პაროლი</Label>
                    <Input id="new-password" type="password" required />
                  </div>
                  <Button type="submit">პაროლის შეცვლა</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
