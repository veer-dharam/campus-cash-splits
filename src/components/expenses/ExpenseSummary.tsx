
import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { calculateUserBalance, formatCurrency } from "@/lib/utils/expense";
import { Card } from "@/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";

export function ExpenseSummary() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, currentUser } = useApp();
  
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return <div className="text-center p-4">Group not found</div>;
  }
  
  // Calculate total spent by each member
  const memberExpenses = group.members.map(member => {
    // Total amount paid by this member
    const totalPaid = group.expenses
      .filter(expense => expense.paidBy === member.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate balance (positive means user is owed money)
    const balance = calculateUserBalance(group, member.id);
    
    return {
      member,
      totalPaid,
      balance,
      isCurrentUser: member.id === currentUser.id
    };
  });
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Expense Summary</h3>
      <div className="grid grid-cols-1 gap-4">
        {memberExpenses.map(({ member, totalPaid, balance, isCurrentUser }) => (
          <Card key={member.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {isCurrentUser ? "You" : member.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total spent: {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="flex items-center">
                {balance > 0 ? (
                  <>
                    <PlusCircle className="h-5 w-5 text-success mr-1" />
                    <span className="text-success font-medium">
                      {formatCurrency(balance)}
                    </span>
                  </>
                ) : balance < 0 ? (
                  <>
                    <MinusCircle className="h-5 w-5 text-debt mr-1" />
                    <span className="text-debt font-medium">
                      {formatCurrency(Math.abs(balance))}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Settled</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
