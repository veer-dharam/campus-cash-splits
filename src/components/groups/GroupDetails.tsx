
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddMemberDialog } from "./AddMemberDialog";
import { GroupMembers } from "./GroupMembers";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { GroupChatDialog } from "./GroupChatDialog";
import { User } from "@/types";

const DEFAULT_USER: User = { id: "me", name: "You", email: "" };

export function GroupDetails() {
  // For demo: state in local. For production, use backend/store.
  const [members, setMembers] = useState<User[]>([DEFAULT_USER]);
  const [addDialog, setAddDialog] = useState(false);
  const [groupChatOpen, setGroupChatOpen] = useState(false);

  const handleAddMember = (user: User) => {
    setMembers((old) =>
      old.some((m) => m.name === user.name) ? old : [...old, user]
    );
  };

  return (
    <>
      <PageHeader
        title="Group"
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
      <div className="p-4">
        <GroupMembers members={members} currentUser={DEFAULT_USER} />
      </div>
      <AddMemberDialog
        open={addDialog}
        onOpenChange={setAddDialog}
        onAdd={handleAddMember}
      />
      <GroupChatDialog open={groupChatOpen} onOpenChange={setGroupChatOpen} />
    </>
  );
}
