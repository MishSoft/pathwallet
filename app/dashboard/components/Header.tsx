"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    // წაშლა local storage-დან JWT ტოკენს
    localStorage.removeItem("token");
    // გადამისამართება შესვლის გვერდზე
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">PathWallet</span>
      </div>
      <Button variant="ghost" onClick={handleLogout}>
        გამოსვლა
      </Button>
    </header>
  );
};

export default Header;
