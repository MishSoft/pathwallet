"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import AddGoalModal from "./components/AddGoalModal";

// დროებითი მონაცემები
const goalsData = [
  { id: "1", title: "ახალი მანქანა", targetAmount: 20000, savedAmount: 5000 },
  { id: "2", title: "მოგზაურობა", targetAmount: 3000, savedAmount: 1200 },
  {
    id: "3",
    title: "საგანმანათლებლო კურსი",
    targetAmount: 500,
    savedAmount: 500,
  },
];

const GoalsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // დროებითი ფუნქცია
  const handleAddGoal = (goal: { title: string; targetAmount: number }) => {
    console.log("ახალი მიზანი დაემატა:", goal);
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
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-3xl font-bold">მიზნები</CardTitle>
              <AddGoalModal onAddGoal={handleAddGoal} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {goalsData.map((goal) => {
                  const progress = (goal.savedAmount / goal.targetAmount) * 100;
                  return (
                    <Card key={goal.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{goal.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            დაგროვილი: {goal.savedAmount} ლარი /{" "}
                            {goal.targetAmount} ლარი
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          წაშლა
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <Progress value={progress} className="h-2" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
