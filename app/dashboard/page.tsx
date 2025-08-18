"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StackCard";
import RecentTransactions from "./components/RecentTransactions";
import ExpenseChart from "./components/ExpenseChart";
import Loader from "./components/Loader";

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
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userName, setUserName] = useState("");

  // მონაცემების წამოღება cookie-ს გამოყენებით
  const fetchFinancialData = async () => {
    try {
      const [incomeRes, expenseRes, userRes] = await Promise.all([
        fetch("/api/income", { credentials: "include" }),
        fetch("/api/expence", { credentials: "include" }),
        fetch("/api/user", { credentials: "include" }),
      ]);

      if (incomeRes.ok && expenseRes.ok && userRes.ok) {
        const incomeData = await incomeRes.json();
        const expenseData = await expenseRes.json();
        const userData = await userRes.json();

        setIncomes(incomeData);
        setExpenses(expenseData);
        setUserName(userData.name || userData.email.split("@")[0]);
      } else {
        // თუ cookie ვადexpiredა ან მომხმარებელი არაა ავტორიზებული
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // სტატისტიკის გამოთვლა
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const balance = totalIncome - totalExpense;

  // ახალი ფუნქციები, რომლებიც გადაეცემა props-ის სახით
  const handleAddIncomeClick = () => {
    router.push("/dashboard/income");
  };
  const handleAddExpenseClick = () => {
    router.push("/dashboard/expense");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 border w-full p-8 bg-gray-100 dark:bg-gray-950">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">Main Board</h1>
            <p className="text-gray-600">Welcome, {userName}</p>
          </header>
          {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
              <Loader />
            </div>
          ) : (
            <>
              <section className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <StatsCard
                  title="Monthly Balance"
                  value={`${balance} $`}
                  description="Last 30 Days"
                />
                <StatsCard
                  title="Total Income"
                  value={`${totalIncome} $`}
                  description="Last 30 Days"
                />
                <StatsCard
                  title="Total Expenses"
                  value={`${totalExpense} $`}
                  description="Last 30 Days"
                />
              </section>

              <section className="dd_ert flex flex-col gap-4 lg:grid-cols-2">
                <RecentTransactions
                  onAddIncomeClick={handleAddIncomeClick}
                  onAddExpenseClick={handleAddExpenseClick}
                  incomes={incomes}
                  expenses={expenses}
                />
                <ExpenseChart expenses={expenses} />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
