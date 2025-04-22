
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopNav } from '@/components/NavigationMenu';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  createdAt: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

const Group = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    paidBy: 'You'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const loadGroupAndExpenses = () => {
    try {
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const foundGroup = storedGroups.find((g: Group) => g.id === id);
      
      if (foundGroup) {
        setGroup(foundGroup);
        const storedExpenses = JSON.parse(localStorage.getItem(`expenses-${id}`) || '[]');
        setExpenses(storedExpenses);
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

  useEffect(() => {
    loadGroupAndExpenses();
  }, [id, navigate, toast]);

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const expense: Expense = {
      id: Math.random().toString(36).substring(2, 11),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, expense];
    localStorage.setItem(`expenses-${id}`, JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    setNewExpense({ title: '', amount: '', paidBy: 'You' });
    setIsDialogOpen(false);

    toast({
      title: "Expense Added",
      description: "The expense has been added successfully.",
    });
  };

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

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Expenses</h2>
            </div>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <Card key={expense.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block">{expense.title}</span>
                      <span className="text-sm text-muted-foreground">Paid by {expense.paidBy}</span>
                    </div>
                    <span className="text-muted-foreground">₹{expense.amount}</span>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No expenses yet</p>
            )}
          </div>

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
                    {group.members.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
                <Button className="w-full" onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Group;
