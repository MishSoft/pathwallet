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
import AddIncomeModal from "./components/AddIncomeModal";

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

const IncomePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const fetchIncomes = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Income[] = await response.json();
        setIncomes(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        throw new Error("Failed to fetch incomes.");
      }
    } catch (error) {
      console.error("Failed to fetch incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (newIncome: {
    source: string;
    amount: number;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // სწორი ფორმატი
        },
        body: JSON.stringify(newIncome),
      });

      if (response.ok) {
        await fetchIncomes(token);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add income.");
      }
    } catch (error) {
      console.error("Failed to add income:", error);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/income", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // სწორი ფორმატი
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchIncomes(token);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete income.");
      }
    } catch (error) {
      console.error("Failed to delete income:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchIncomes(token);
    }
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
    <div className="flex  flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 w-full p-8 bg-gray-100 dark:bg-gray-950">
          <Card>
            <CardHeader className="flex md:flex-row md:items-center flex-col justify-between">
              <CardTitle className="text-3xl font-bold">შემოსავლები</CardTitle>
              <AddIncomeModal onAddIncome={handleAddIncome} />
            </CardHeader>
            <CardContent>
              {incomes.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>წყარო</TableHead>
                        <TableHead>თანხა</TableHead>
                        <TableHead>თარიღი</TableHead>
                        <TableHead>მოქმედება</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomes.map((income) => (
                        <TableRow key={income.id}>
                          <TableCell>{income.source}</TableCell>
                          <TableCell>{income.amount} ლარი</TableCell>
                          <TableCell>
                            {new Date(income.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteIncome(income.id)}
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
                  <p>ჯერ არ გაქვთ დამატებული შემოსავალი.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
