// src/components/layout/Header.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react"; // AI იკონი

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">PathWallet</span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/chat">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" onClick={handleLogout}>
          გამოსვლა
        </Button>
      </div>
    </header>
  );
};

export default Header;
