/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/login/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // გვერდის ჩატვირთვისას ვამოწმებთ, არსებობს თუ არა ტოკენი
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "შესვლა ვერ მოხერხდა.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">შესვლა</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            შეიყვანეთ თქვენი ელფოსტა და პაროლი თქვენს ანგარიშში შესასვლელად
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">ელფოსტა</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">პაროლი</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "შესვლა..." : "შესვლა"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            ჯერ არ გაქვთ ანგარიში?{" "}
            <a href="/register" className="font-semibold underline">
              დარეგისტრირდით
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
