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

// დროებითი მონაცემები ცხრილისთვის
const expenseData = [
  { id: "1", category: "საკვები", amount: 500, date: "2025-08-05" },
  { id: "2", category: "ქირა", amount: 800, date: "2025-08-02" },
  { id: "3", category: "გასართობი", amount: 120, date: "2025-07-30" },
];

const ExpensesPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // დროებითი ფუნქცია, რომელიც მოგვიანებით დააკავშირებთ ბეკენდს
  const handleAddExpense = (expense: { category: string; amount: number }) => {
    console.log("ახალი ხარჯი დაემატა:", expense);
    // აქ მოგვიანებით დაემატება ბეკენდზე მონაცემების გაგზავნის ლოგიკა
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
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950 ">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-3xl font-bold">ხარჯები</CardTitle>
              <AddExpenseModal onAddExpense={handleAddExpense} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>კატეგორია</TableHead>
                    <TableHead>თანხა</TableHead>
                    <TableHead>თარიღი</TableHead>
                    <TableHead>მოქმედება</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseData.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.amount} ლარი</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          წაშლა
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
