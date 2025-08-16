// src/components/layout/Sidebar.tsx

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Home, Landmark, PiggyBank, Target, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "დაფა", icon: Home },
  { href: "/dashboard/income", label: "შემოსავალი", icon: Landmark },
  { href: "/dashboard/expense", label: "ხარჯები", icon: PiggyBank },
  { href: "/dashboard/goals", label: "მიზნები", icon: Target },
  { href: "/dashboard/settings", label: "პარამეტრები", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className=" z-10 w-full flex-row sm:w-20 sm:flex-col border-r bg-background sm:flex">
      <nav className="flex sm:flex-col p-2 flex-row items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          P
        </Link>
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 
                      ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;
