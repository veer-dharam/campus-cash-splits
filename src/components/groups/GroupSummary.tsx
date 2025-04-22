
import React from 'react';
import { Card } from "@/components/ui/card";

interface GroupSummaryProps {
  description?: string;
  totalSpent: number;
}

export const GroupSummary = ({ description, totalSpent }: GroupSummaryProps) => {
  return (
    <div className="space-y-6">
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Spent</span>
          <span className="text-xl font-semibold">₹{totalSpent}</span>
        </div>
      </Card>
    </div>
  );
};
