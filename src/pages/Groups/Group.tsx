
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopNav } from '@/components/NavigationMenu';
import { useToast } from "@/hooks/use-toast";

interface Expense {
  title: string;
  amount: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

const expenses: Expense[] = [
  { title: "Dinner", amount: 500 },
  { title: "Cab", amount: 300 },
  { title: "Groceries", amount: 1000 },
  { title: "Tickets", amount: 700 },
];

const Group = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourBalance = -600; // This would come from your backend

  useEffect(() => {
    // Load group data based on ID
    const loadGroup = () => {
      try {
        const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const foundGroup = storedGroups.find((g: Group) => g.id === id);
        
        if (foundGroup) {
          setGroup(foundGroup);
        } else {
          toast({
            title: "Group not found",
            description: "The requested group could not be found.",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error loading group:", error);
        toast({
          title: "Error",
          description: "Failed to load group data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container max-w-2xl mx-auto px-4 py-8 flex justify-center">
          <p>Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

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
          <h1 className="text-2xl font-semibold">{group.name}</h1>
        </div>

        {group.description && (
          <p className="text-muted-foreground mb-6">{group.description}</p>
        )}

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
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Expenses</h2>
            </div>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <span>{expense.title}</span>
                    <span className="text-muted-foreground">₹{expense.amount}</span>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No expenses yet</p>
            )}
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
