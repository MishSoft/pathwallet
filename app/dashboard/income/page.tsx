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
import Loader from "../components/Loader";

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

const IncomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/income", {
        credentials: "include", // cookie-based ავტორიზაციისთვის
      });

      if (response.ok) {
        const data: Income[] = await response.json();
        setIncomes(data);
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        throw new Error("Failed to fetch incomes.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to fetch incomes:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (newIncome: {
    source: string;
    amount: number;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newIncome),
      });

      if (response.ok) {
        await fetchIncomes();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add income.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to add income:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/income", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchIncomes();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete income.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to delete income:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 w-full p-8 bg-gray-100 dark:bg-gray-950">
          <Card>
            <CardHeader className="flex md:flex-row md:items-center flex-col justify-between">
              <CardTitle className="text-3xl font-bold">Income</CardTitle>
              <AddIncomeModal onAddIncome={handleAddIncome} />
            </CardHeader>
            <CardContent>
              {incomes.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
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
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven&apos;t added any income yet.</p>
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
