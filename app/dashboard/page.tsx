// src/app/dashboard/page.tsx (განახლებული ვერსია)

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StackCard";
import RecentTransactions from "./components/RecentTransactions"; // ახალი კომპონენტის იმპორტი
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExpenseChart from "./components/ExpenseChart";

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <div className="flex flex-col ">
      <Header />
      <div className="flex ">
        <Sidebar />
        <div className="w-full p-8 bg-gray-100 dark:bg-gray-950 ">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">მთავარი დაფა</h1>
            <p className="text-gray-600">
              კეთილი იყოს თქვენი მობრძანება, მომხმარებელო
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard
              title="თვიური ბალანსი"
              value="1,250 ლარი"
              description="ბოლო 30 დღეში"
            />
            <StatsCard
              title="მთლიანი შემოსავალი"
              value="2,500 ლარი"
              description="ბოლო 30 დღეში"
            />
            <StatsCard
              title="მთლიანი ხარჯი"
              value="1,250 ლარი"
              description="ბოლო 30 დღეში"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <RecentTransactions />

            <Card>
              <CardHeader>
                <CardTitle>ხარჯების განაწილება</CardTitle>
                <CardDescription>
                  თვიური ხარჯები კატეგორიის მიხედვით
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseChart />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
