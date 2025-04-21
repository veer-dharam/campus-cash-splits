
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { calculateTotalSpent, calculateUserBalance, formatCurrency } from "@/lib/utils/expense";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function GroupDetails() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, currentUser, setCurrentGroup } = useApp();
  const navigate = useNavigate();
  
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
  
  return (
    <>
      <PageHeader 
        title={group.name} 
        backTo="/"
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
