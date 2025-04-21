
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils/expense";
import { cn } from "@/lib/utils";

export function AddExpense() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { groups, currentUser, addExpense } = useApp();
  
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Group not found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [participants, setParticipants] = useState<string[]>(
    group.members.map(member => member.id)
  );
  
  const handleToggleParticipant = (userId: string) => {
    if (participants.includes(userId)) {
      setParticipants(participants.filter(id => id !== userId));
    } else {
      setParticipants([...participants, userId]);
    }
  };
  
  const handleSubmit = () => {
    if (description.trim() && amount && participants.length > 0) {
      addExpense(group.id, {
        amount: parseFloat(amount),
        description: description.trim(),
        paidBy,
        participants,
        date: new Date().toISOString(),
      });
      
      navigate(`/groups/${group.id}`);
    }
  };
  
  return (
    <>
      <PageHeader 
        title="Add Expense" 
        backTo={`/groups/${group.id}`}
      />
      
      <div className="p-4">
        <div className="mb-4">
          <Label className="block mb-1">Paid by</Label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            >
              {group.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.id === currentUser.id ? "You" : member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="amount" className="block mb-1">Amount</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="description" className="block mb-1">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            className="min-h-24"
          />
        </div>
        
        <div className="mb-6">
          <Label className="block mb-1">Paid by You and Them</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {group.members.map((member) => (
              <button
                key={member.id}
                type="button"
                className={cn(
                  "px-3 py-2 rounded-full text-sm font-medium",
                  participants.includes(member.id)
                    ? "bg-expense text-white"
                    : "bg-gray-100 text-gray-600"
                )}
                onClick={() => handleToggleParticipant(member.id)}
              >
                {member.id === currentUser.id ? "You" : member.name}
              </button>
            ))}
          </div>
        </div>
        
        <Button
          variant="expense"
          className="w-full"
          onClick={handleSubmit}
          disabled={!description.trim() || !amount || participants.length === 0}
        >
          Done
        </Button>
      </div>
    </>
  );
}
