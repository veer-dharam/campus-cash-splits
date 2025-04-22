
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from './ExpenseForm';
import { ExpenseCard } from './ExpenseCard';
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  createdAt: string;
}

interface ExpensesListProps {
  groupId: string;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  members: string[];
}

export const ExpensesList = ({ groupId, expenses, setExpenses, members }: ExpensesListProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: 'You',
    splitBetween: [] as string[]
  });

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount || newExpense.splitBetween.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one member to split with.",
        variant: "destructive",
      });
      return;
    }

    const expense: Expense = {
      id: Math.random().toString(36).substring(2, 11),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      splitBetween: newExpense.splitBetween,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, expense];
    localStorage.setItem(`expenses-${groupId}`, JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    setNewExpense({ title: '', amount: '', paidBy: 'You', splitBetween: [] });
    setIsDialogOpen(false);

    toast({
      title: "Expense Added",
      description: "The expense has been added successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Recent Expenses</h2>
      </div>
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            title={expense.title}
            amount={expense.amount}
            paidBy={expense.paidBy}
            splitBetween={expense.splitBetween}
          />
        ))
      ) : (
        <p className="text-muted-foreground text-center py-4">No expenses yet</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            newExpense={newExpense}
            setNewExpense={setNewExpense}
            groupMembers={members}
            onSubmit={handleAddExpense}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
