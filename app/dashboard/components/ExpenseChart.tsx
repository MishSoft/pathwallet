// src/components/dashboard/ExpenseChart.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Expense {
  category: string;
  amount: number;
}

const data: Expense[] = [
  { category: "საკვები", amount: 500 },
  { category: "ქირა", amount: 800 },
  { category: "გასართობი", amount: 200 },
  { category: "ტანსაცმელი", amount: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpenseChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ხარჯების განაწილება</CardTitle>
        <CardDescription>თვიური ხარჯები კატეგორიის მიხედვით</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
