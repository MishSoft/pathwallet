"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import AddGoalModal from "./components/AddGoalModal";
import Loader from "../components/Loader";

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
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/goals", {
        credentials: "include", // cookie ავტორიზაციისთვის
      });

      if (response.ok) {
        const data: FinancialGoal[] = await response.json();
        setGoals(data);
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        throw new Error("Failed to fetch goals.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to fetch goals:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (newGoal: {
    title: string;
    targetAmount: number;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        await fetchGoals();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add goal.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to add goal:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/goals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchGoals();
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete goal.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to delete goal:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
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
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle className="text-3xl font-bold">Goals</CardTitle>
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
                              Accumulated: {goal.savedAmount} $ /{" "}
                              {goal.targetAmount} $
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            Delete
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
                    <p>You haven&apos;t added any goals yet.</p>
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
