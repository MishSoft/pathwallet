// src/components/dashboard/StatsCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardHeader>
    </Card>
  );
};

export default StatsCard;
