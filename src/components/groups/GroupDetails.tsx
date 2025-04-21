
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { calculateTotalSpent, calculateUserBalance, formatCurrency } from "@/lib/utils/expense";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function GroupDetails() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, currentUser, setCurrentGroup, addUserToGroup } = useApp();
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [addError, setAddError] = useState("");

  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Group not found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  setCurrentGroup(group.id);

  const totalSpent = calculateTotalSpent(group);
  const userBalance = calculateUserBalance(group, currentUser.id);

  const handleAddExpense = () => {
    navigate(`/groups/${group.id}/expenses/add`);
  };

  const renderExpenseItem = (description: string, index: number) => {
    const expense = group.expenses.find(e => e.description === description);
    if (!expense) return null;
    
    return (
      <div 
        key={index} 
        className="p-4 bg-gray-50 rounded-lg mb-2 text-left hover:bg-gray-100 transition-colors"
        onClick={() => navigate(`/groups/${group.id}/expenses/${expense.id}`)}
      >
        <h3 className="font-medium text-gray-900">{expense.description}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Paid by {group.members.find(m => m.id === expense.paidBy)?.name || 'Unknown'}
        </p>
      </div>
    );
  };

  const handleMemberAdd = () => {
    const name = newMemberName.trim();
    if (!name) {
      setAddError("Name required");
      return;
    }
    if (group.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
      setAddError("Member already exists");
      return;
    }
    addUserToGroup(group.id, {
      id: `member-${Date.now()}`,
      name,
    });
    setNewMemberName("");
    setAddError("");
    setAddDialogOpen(false);
  };

  return (
    <>
      <PageHeader 
        title={group.name} 
        backTo="/"
        actions={
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="gap-1"
                title="Add Member"
              >
                <UserPlus size={18} />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="member-name">Member Name</Label>
                <Input
                  id="member-name"
                  value={newMemberName}
                  onChange={e => {
                    setNewMemberName(e.target.value);
                    setAddError("");
                  }}
                  placeholder="Enter a name"
                  autoFocus
                />
                {addError && <div className="text-sm text-red-500">{addError}</div>}
              </div>
              <DialogFooter>
                <Button
                  variant="expense"
                  className="w-full"
                  onClick={handleMemberAdd}
                  disabled={newMemberName.trim() === ""}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm text-gray-500 mb-1">Total Spent</h3>
            <p className="text-xl font-semibold">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm text-gray-500 mb-1">Your Balance</h3>
            <p className={cn(
              "text-xl font-semibold",
              userBalance > 0 ? "text-success" : userBalance < 0 ? "text-debt" : ""
            )}>
              {userBalance > 0 
                ? `You are owed ${formatCurrency(userBalance)}` 
                : userBalance < 0 
                  ? `You owe ${formatCurrency(Math.abs(userBalance))}` 
                  : "All settled up"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-muted-foreground font-semibold mb-1">Members</h3>
          <ul className="flex flex-wrap gap-2 mb-2">
            {group.members.map(member => (
              <li key={member.id} className="bg-gray-100 px-3 py-1 rounded text-sm">
                {member.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          {group.expenses.length > 0 ? (
            group.expenses
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense, index) => renderExpenseItem(expense.description, index))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses yet</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={handleAddExpense}
              >
                Add your first expense
              </Button>
            </div>
          )}
        </div>
        
        <Button 
          variant="expense"
          className="w-full"
          onClick={handleAddExpense}
        >
          <PlusCircle size={18} />
          Add Expense
        </Button>
      </div>
    </>
  );
}
