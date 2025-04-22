
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ExpenseFormProps {
  newExpense: {
    title: string;
    amount: string;
    paidBy: string;
    splitBetween: string[];
  };
  setNewExpense: React.Dispatch<React.SetStateAction<{
    title: string;
    amount: string;
    paidBy: string;
    splitBetween: string[];
  }>>;
  groupMembers: string[];
  onSubmit: () => void;
}

export const ExpenseForm = ({ 
  newExpense, 
  setNewExpense, 
  groupMembers, 
  onSubmit 
}: ExpenseFormProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What was this expense for?"
          value={newExpense.title}
          onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="₹"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paidBy">Paid By</Label>
        <select
          id="paidBy"
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
          value={newExpense.paidBy}
          onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
        >
          {groupMembers && groupMembers.length > 0 ? (
            groupMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))
          ) : (
            <option value="You">You</option>
          )}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Split Between</Label>
        <div className="space-y-2">
          {groupMembers && groupMembers.length > 0 ? (
            groupMembers.map((member) => (
              <div key={member} className="flex items-center space-x-2">
                <Checkbox
                  id={`member-${member}`}
                  checked={newExpense.splitBetween.includes(member)}
                  onCheckedChange={(checked) => {
                    setNewExpense({
                      ...newExpense,
                      splitBetween: checked
                        ? [...newExpense.splitBetween, member]
                        : newExpense.splitBetween.filter((m) => m !== member)
                    });
                  }}
                />
                <label
                  htmlFor={`member-${member}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {member}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No members available to split with.</p>
          )}
        </div>
      </div>
      <Button className="w-full" onClick={onSubmit}>
        Add Expense
      </Button>
    </div>
  );
};
