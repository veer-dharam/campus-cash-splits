
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopNav } from '@/components/NavigationMenu';

interface Expense {
  title: string;
  amount: number;
}

const expenses: Expense[] = [
  { title: "Dinner", amount: 500 },
  { title: "Cab", amount: 300 },
  { title: "Groceries", amount: 1000 },
  { title: "Tickets", amount: 700 },
];

const Group = () => {
  const navigate = useNavigate();
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourBalance = -600; // This would come from your backend

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6 gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Goa Trip</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="text-xl font-semibold">₹{totalSpent}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Your Balance</span>
              <span className={`text-xl font-semibold ${yourBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {yourBalance < 0 ? 'You owe' : 'You get back'} ₹{Math.abs(yourBalance)}
              </span>
            </div>
          </Card>

          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense.title} className="p-4">
                <div className="flex justify-between items-center">
                  <span>{expense.title}</span>
                  <span className="text-muted-foreground">₹{expense.amount}</span>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            className="w-full"
            onClick={() => navigate('/expenses/new')}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Group;
