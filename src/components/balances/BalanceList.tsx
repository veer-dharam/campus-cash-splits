
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { calculateBalances, formatCurrency, getUserById } from "@/lib/utils/expense";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function BalanceList() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, currentUser, createSettlement } = useApp();
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
  
  const balances = calculateBalances(group);
  
  // Balances where current user is involved
  const userOwes = balances.filter(balance => balance.from === currentUser.id);
  const othersOwe = balances.filter(balance => balance.to === currentUser.id);
  
  const handleSettleUp = (from: string, to: string, amount: number) => {
    createSettlement(group.id, from, to, amount);
    navigate(`/groups/${group.id}`);
  };
  
  return (
    <>
      <PageHeader 
        title="Balances" 
        backTo={`/groups/${group.id}`}
      />
      
      <div className="p-4">
        {userOwes.length === 0 && othersOwe.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">All settled up! No debts in this group.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userOwes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">YOU OWE</h3>
                {userOwes.map((balance) => {
                  const toUser = getUserById(group, balance.to);
                  return (
                    <div 
                      key={`${balance.from}-${balance.to}`}
                      className="bg-white rounded-lg p-4 border border-gray-200 mb-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">You owe {toUser?.name}</p>
                        <p className="text-lg font-semibold text-debt">{formatCurrency(balance.amount)}</p>
                      </div>
                      <Button
                        variant="expense"
                        onClick={() => handleSettleUp(balance.from, balance.to, balance.amount)}
                      >
                        <Check size={16} />
                        Settle
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {othersOwe.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">YOU ARE OWED</h3>
                {othersOwe.map((balance) => {
                  const fromUser = getUserById(group, balance.from);
                  return (
                    <div 
                      key={`${balance.from}-${balance.to}`}
                      className="bg-white rounded-lg p-4 border border-gray-200 mb-2"
                    >
                      <p className="font-medium">{fromUser?.name} owes you</p>
                      <p className="text-lg font-semibold text-success">{formatCurrency(balance.amount)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
