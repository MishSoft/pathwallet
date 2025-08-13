// src/components/dashboard/RecentTransactions.tsx

import React from "react";
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

interface Transaction {
  type: "შემოსავალი" | "ხარჯი";
  source?: string;
  category?: string;
  amount: number;
  date: string;
}

const transactions: Transaction[] = [
  { type: "შემოსავალი", source: "ხელფასი", amount: 2500, date: "2025-08-01" },
  { type: "ხარჯი", category: "საკვები", amount: 500, date: "2025-08-05" },
  { type: "ხარჯი", category: "ქირა", amount: 800, date: "2025-08-02" },
];

const RecentTransactions = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">ბოლო ტრანზაქციები</CardTitle>
        <div className="space-x-2">
          <Button variant="outline">შემოსავლის დამატება</Button>
          <Button>ხარჯის დამატება</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ტიპი</TableHead>
              <TableHead>აღწერა</TableHead>
              <TableHead>თანხა</TableHead>
              <TableHead>თარიღი</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t, index) => (
              <TableRow
                key={index}
                className={
                  t.type === "ხარჯი" ? "text-red-500" : "text-green-500"
                }
              >
                <TableCell>{t.type}</TableCell>
                <TableCell>{t.source || t.category}</TableCell>
                <TableCell>{t.amount} ლარი</TableCell>
                <TableCell>{t.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
