"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import AddGoalModal from "./components/AddGoalModal";

// მონაცემთა ტიპების განსაზღვრა
interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
}

const GoalsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/goals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: FinancialGoal[] = await response.json();
        setGoals(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        throw new Error("Failed to fetch goals.");
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (newGoal: {
    title: string;
    targetAmount: number;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        await fetchGoals();
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add goal.");
      }
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/goals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchGoals();
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete goal.");
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchGoals();
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 w-full p-8 bg-gray-100 dark:bg-gray-950">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle className="text-3xl font-bold">მიზნები</CardTitle>
              <AddGoalModal onAddGoal={handleAddGoal} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {goals.length > 0 ? (
                  goals.map((goal) => {
                    const progress =
                      (goal.savedAmount / goal.targetAmount) * 100;
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            წაშლა
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <Progress value={progress} className="h-2" />
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>ჯერ არ გაქვთ დამატებული მიზნები.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
