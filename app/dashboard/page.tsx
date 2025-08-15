"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StackCard";
import RecentTransactions from "./components/RecentTransactions";
import ExpenseChart from "./components/ExpenseChart";

// მონაცემთა ტიპების განსაზღვრა
interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // მონაცემების წამოღების ფუნქცია
  const fetchFinancialData = async (token: string) => {
    try {
      const incomeRes = await fetch("/api/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const expenseRes = await fetch("/api/expence", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (incomeRes.ok && expenseRes.ok) {
        const incomeData = await incomeRes.json();
        const expenseData = await expenseRes.json();
        setIncomes(incomeData);
        setExpenses(expenseData);
      }
    } catch (error) {
      console.error("Failed to fetch financial data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchFinancialData(token);
    }
    setLoading(false);
  }, [router]);

  // სტატისტიკის გამოთვლა
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const balance = totalIncome - totalExpense;

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
          <header className="mb-8">
            <h1 className="text-4xl font-bold">მთავარი დაფა</h1>
            <p className="text-gray-600">
              კეთილი იყოს თქვენი მობრძანება, მომხმარებელო
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard
              title="თვიური ბალანსი"
              value={`${balance} ლარი`}
              description="ბოლო 30 დღეში"
            />
            <StatsCard
              title="მთლიანი შემოსავალი"
              value={`${totalIncome} ლარი`}
              description="ბოლო 30 დღეში"
            />
            <StatsCard
              title="მთლიანი ხარჯი"
              value={`${totalExpense} ლარი`}
              description="ბოლო 30 დღეში"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {/* აქ გადავცემთ დინამიურ მონაცემებს */}
            <RecentTransactions incomes={incomes} expenses={expenses} />
            <ExpenseChart expenses={expenses} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
