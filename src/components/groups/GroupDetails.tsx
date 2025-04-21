
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddMemberDialog } from "./AddMemberDialog";
import { GroupMembers } from "./GroupMembers";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, PlusCircle } from "lucide-react";
import { GroupChatDialog } from "./GroupChatDialog";
import { User } from "@/types";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";

export function GroupDetails() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, currentUser } = useApp();
  
  const group = groups.find(g => g.id === groupId);
  const [addDialog, setAddDialog] = useState(false);
  const [groupChatOpen, setGroupChatOpen] = useState(false);

  if (!group) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Group not found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const handleAddExpense = () => {
    navigate(`/groups/${groupId}/expenses/add`);
  };

  const handleAddMember = (user: User) => {
    setMembers((old) =>
      old.some((m) => m.name === user.name) ? old : [...old, user]
    );
  };

  return (
    <>
      <PageHeader
        title={group.name}
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddDialog(true)}
            >
              <UserPlus size={18} className="mr-1" />
              Add Member
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setGroupChatOpen(true)}
            >
              <Users size={18} className="mr-1" />
              Group Chat
            </Button>
          </div>
        }
      />
      <div className="p-4 space-y-6 pb-20">
        <GroupMembers members={group.members} currentUser={currentUser} />
        
        <ExpenseSummary />
        
        <div className="fixed bottom-16 right-4 z-10">
          <Button
            size="lg"
            variant="expense"
            className="rounded-full shadow-lg"
            onClick={handleAddExpense}
          >
            <PlusCircle className="mr-1" />
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
