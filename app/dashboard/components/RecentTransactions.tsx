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

// მონაცემთა ტიპების განსაზღვრა
interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface RecentTransactionsProps {
  incomes: Income[];
  expenses: Expense[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  incomes,
  expenses,
}) => {
  // მონაცემების გაერთიანება და დახარისხება თარიღის მიხედვით
  const transactions = [...incomes, ...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
                className={"source" in t ? "text-green-500" : "text-red-500"}
              >
                <TableCell>{"source" in t ? "შემოსავალი" : "ხარჯი"}</TableCell>
                <TableCell>{"source" in t ? t.source : t.category}</TableCell>
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
