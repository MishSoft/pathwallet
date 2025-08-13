// src/app/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      // მომავალში აქ დავამატებთ ტოკენის ვალიდაციას
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
    return null; // ან შეგიძლიათ აჩვენოთ შეტყობინება
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <h1 className="text-4xl font-bold">
        კეთილი იყოს თქვენი მობრძანება დაფაზე!
      </h1>
    </div>
  );
};

export default DashboardPage;
