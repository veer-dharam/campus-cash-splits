import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopNav } from '@/components/NavigationMenu';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { GroupHeader } from '@/components/groups/GroupHeader';
import { MemberManagement } from '@/components/groups/MemberManagement';
import { ChatSystem } from '@/components/groups/ChatSystem';

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
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
    paidBy: 'You',
    splitBetween: [] as string[]
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

  const handleDeleteGroup = () => {
    try {
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const updatedGroups = storedGroups.filter((g: Group) => g.id !== id);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      localStorage.removeItem(`expenses-${id}`);
      
      toast({
        title: "Group Deleted",
        description: "The group has been deleted successfully.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Error",
        description: "Failed to delete the group.",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = (newMember: string) => {
    if (group) {
      const updatedGroup = {
        ...group,
        members: [...group.members, newMember]
      };
      
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const updatedGroups = storedGroups.map((g: Group) => 
        g.id === id ? updatedGroup : g
      );
      
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      setGroup(updatedGroup);
      
      toast({
        title: "Member Added",
        description: `${newMember} has been added to the group.`,
      });
    }
  };

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
    localStorage.setItem(`expenses-${id}`, JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    setNewExpense({ title: '', amount: '', paidBy: 'You', splitBetween: [] });
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
        <GroupHeader 
          groupName={group.name}
          onBack={() => navigate('/')}
          onDelete={handleDeleteGroup}
        />

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

          <MemberManagement 
            members={group.members} 
            onAddMember={handleAddMember} 
          />

          <ChatSystem 
            groupId={group.id} 
            members={group.members} 
          />

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
              <ExpenseForm
                newExpense={newExpense}
                setNewExpense={setNewExpense}
                groupMembers={group.members}
                onSubmit={handleAddExpense}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Group;
