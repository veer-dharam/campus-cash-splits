
import { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";
import { MemberChatDialog } from "./MemberChatDialog";

interface GroupMembersProps {
  members: User[];
  currentUser: User;
}
export function GroupMembers({ members, currentUser }: GroupMembersProps) {
  const [chatMember, setChatMember] = useState<User | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleChat = (member: User) => {
    setChatMember(member);
    setChatOpen(true);
  };

  return (
    <div className="mt-4">
      <h3 className="text-base font-semibold mb-3">Members</h3>
      <ul className="space-y-1 mb-2">
        {members.map(member => (
          <li key={member.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-primary font-bold">
                {member.name[0].toUpperCase()}
              </div>
              <span className="font-medium">{member.name}</span>
            </div>
            {member.id !== currentUser.id && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => handleChat(member)}
              >
                <MessageCircle size={16} />
                Message
              </Button>
            )}
          </li>
        ))}
      </ul>
      {chatMember && (
        <MemberChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          currentUser={currentUser}
          member={chatMember}
        />
      )}
    </div>
  );
}
