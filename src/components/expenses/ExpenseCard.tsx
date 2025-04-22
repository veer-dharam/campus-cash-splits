
import React from 'react';
import { Card } from "@/components/ui/card";

interface ExpenseCardProps {
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}

export const ExpenseCard = ({ 
  title, 
  amount, 
  paidBy, 
  splitBetween 
}: ExpenseCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="block">{title}</span>
          <span className="text-sm text-muted-foreground">
            Paid by {paidBy}
          </span>
          <span className="text-sm text-muted-foreground block">
            Split between: {splitBetween && splitBetween.length > 0 
              ? splitBetween.join(', ') 
              : 'No members selected'}
          </span>
        </div>
        <span className="text-muted-foreground">₹{amount}</span>
      </div>
    </Card>
  );
};
