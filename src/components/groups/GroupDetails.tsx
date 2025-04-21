
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddMemberDialog } from "./AddMemberDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import { GroupChatDialog } from "./GroupChatDialog";
import { User } from "@/types";
import { calculateUserBalance, calculateTotalSpent, formatCurrency } from "@/lib/utils/expense";

export function GroupDetails() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, currentUser, addUserToGroup } = useApp();

  const group = groups.find((g) => g.id === groupId);

  const [addDialog, setAddDialog] = useState(false);
  const [groupChatOpen, setGroupChatOpen] = useState(false);

  if (!group) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Group not found</h2>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const totalSpent = calculateTotalSpent(group);
  const userBalance = calculateUserBalance(group, currentUser.id);

  // Create a simple sorted expenses array (latest last)
  const expenses = [...group.expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAddExpense = () => {
    navigate(`/groups/${groupId}/expenses/add`);
  };

  const handleAddMember = (user: User) => {
    if (groupId) {
      addUserToGroup(groupId, user);
    }
  };

  return (
    <>
      {/* Minimal header as in the mockup */}
      <PageHeader title={group.name} />

      <div className="p-4 pt-6 max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 mb-1">
          <span className="font-medium text-gray-800">Total Spent</span>
          <span className="font-semibold text-2xl">{formatCurrency(totalSpent)}</span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 mb-1">
          <span className="font-medium text-gray-800">Your Balance</span>
          <span className={`font-semibold text-lg ${userBalance < 0 ? "text-debt" : userBalance > 0 ? "text-success" : "text-gray-700"}`}>
            {userBalance > 0 ? <>You are owed {formatCurrency(userBalance)}</> : userBalance < 0 ? <>You owe {formatCurrency(Math.abs(userBalance))}</> : <>Settled</>}
          </span>
        </div>

        <div>
          {expenses.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No expenses yet</div>
          ) : (
            <ul className="space-y-3">
              {expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex justify-between items-center border rounded-lg bg-gray-50 px-5 py-3"
                >
                  <span className="font-medium text-gray-800">{expense.description}</span>
                  <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            variant="expense"
            className="w-full h-12 text-lg shadow-none rounded-lg"
            onClick={handleAddExpense}
          >
            Add Expense
          </Button>
        </div>
      </div>

      <AddMemberDialog
        open={addDialog}
        onOpenChange={setAddDialog}
        onAdd={handleAddMember}
      />
      <GroupChatDialog
        open={groupChatOpen}
        onOpenChange={setGroupChatOpen}
        currentUser={currentUser}
        group={group}
      />
    </>
  );
}
