"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddExpenseModal from "./components/AddExpenseModal";
import Loader from "../components/Loader";

// მონაცემთა ტიპების განსაზღვრა
interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

const ExpensesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/expence", {
        credentials: "include", // cookie ავტორიზაციისთვის
      });

      if (response.ok) {
        const data: Expense[] = await response.json();
        setExpenses(data);
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        throw new Error("Failed to fetch expenses.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to fetch expenses:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (newExpense: {
    category: string;
    amount: number;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/expence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        await fetchExpenses();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add expense.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to add expense:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/expence", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchExpenses();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete expense.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to delete expense:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 p-8 w-full bg-gray-100 dark:bg-gray-950">
          <Card>
            <CardHeader className="flex md:flex-row flex-col md:items-center justify-between">
              <CardTitle className="text-3xl font-bold">Expenses</CardTitle>
              <AddExpenseModal onAddExpense={handleAddExpense} />
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.amount} $</TableCell>
                          <TableCell>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              წაშლა
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven&apos;t added any expenses yet..</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
