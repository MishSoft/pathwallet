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
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A289FF"];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  // ხარჯების დაჯგუფება კატეგორიების მიხედვით
  const groupedData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ category: expense.category, amount: expense.amount });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ხარჯების განაწილება</CardTitle>
        <CardDescription>თვიური ხარჯები კატეგორიის მიხედვით</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]  flex items-center justify-center ">
        {groupedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={groupedData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
                label={({ name, percent }) =>
                  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                // მცირე ეკრანებზე ლეიბლების ოპტიმიზაცია
                labelLine={false}
              >
                {groupedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* Tooltip-ის და Legend-ის პოზიციების ოპტიმიზაცია */}
              <Tooltip formatter={(value, name) => [`${value} ლარი`, name]} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">ჯერ არ გაქვთ ხარჯები.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
