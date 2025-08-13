// / src/app / income / page.tsx;

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

// დროებითი მონაცემები ცხრილისთვის
const incomeData = [
  { id: "1", source: "ხელფასი", amount: 2500, date: "2025-08-01" },
  { id: "2", source: "ფრილანსინგი", amount: 800, date: "2025-07-28" },
  { id: "3", source: "ინვესტიცია", amount: 150, date: "2025-07-15" },
];

const IncomePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // დროებითი ფუნქცია, რომელიც მოგვიანებით დააკავშირებთ ბეკენდს
  const handleAddIncome = (income: { source: string; amount: number }) => {
    console.log("ახალი შემოსავალი დაემატა:", income);
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
              <CardTitle className="text-3xl font-bold">შემოსავლები</CardTitle>
              <AddIncomeModal onAddIncome={handleAddIncome} />
            </CardHeader>
            <CardContent>
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
                  {incomeData.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{income.source}</TableCell>
                      <TableCell>{income.amount} ლარი</TableCell>
                      <TableCell>{income.date}</TableCell>
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

export default IncomePage;
