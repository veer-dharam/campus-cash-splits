
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface MemberManagementProps {
  members: string[];
  onAddMember: (newMember: string) => void;
}

export const MemberManagement = ({ members, onAddMember }: MemberManagementProps) => {
  const [newMember, setNewMember] = useState('');
  const { toast } = useToast();

  const handleAddMember = () => {
    if (!newMember.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a member name",
        variant: "destructive",
      });
      return;
    }

    if (members.includes(newMember.trim())) {
      toast({
        title: "Member Exists",
        description: "This member is already in the group",
        variant: "destructive",
      });
      return;
    }

    onAddMember(newMember.trim());
    setNewMember('');
    toast({
      title: "Member Added",
      description: `${newMember} has been added to the group`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Members</h2>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div
            key={member}
            className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback>{member[0]}</AvatarFallback>
            </Avatar>
            <span>{member}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add member name"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={handleAddMember}
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
