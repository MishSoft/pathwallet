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

// ახალი ინტერფეისი ღილაკების ფუნქციონალისთვის
interface RecentTransactionsProps {
  incomes: Income[];
  expenses: Expense[];
  onAddIncomeClick: () => void;
  onAddExpenseClick: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  incomes,
  expenses,
  onAddIncomeClick,
  onAddExpenseClick,
}) => {
  // მონაცემების გაერთიანება და დახარისხება თარიღის მიხედვით
  const transactions = [...incomes, ...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card >
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">ბოლო ტრანზაქციები</CardTitle>
        <div className="flex flex-col gap-2 space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={onAddIncomeClick}
            className="w-full sm:w-auto"
          >
            შემოსავლის დამატება
          </Button>
          <Button onClick={onAddExpenseClick} className="w-full sm:w-auto">
            ხარჯის დამატება
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* რესპონსიული კონტეინერი ცხრილისთვის */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px] whitespace-nowrap">
                  ტიპი
                </TableHead>
                <TableHead className="min-w-[150px] whitespace-nowrap">
                  აღწერა
                </TableHead>
                <TableHead className="min-w-[100px] whitespace-nowrap text-right">
                  თანხა
                </TableHead>
                <TableHead className="min-w-[120px] whitespace-nowrap text-right">
                  თარიღი
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t, index) => (
                <TableRow
                  key={index}
                  className={"source" in t ? "text-green-500" : "text-red-500"}
                >
                  <TableCell className="font-medium whitespace-nowrap">
                    {"source" in t ? "შემოსავალი" : "ხარჯი"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {"source" in t ? t.source : t.category}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {t.amount} ლარი
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {new Date(t.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
