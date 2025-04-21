
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { User } from "@/types";

export function CreateGroup() {
  const { createGroup } = useApp();
  const navigate = useNavigate();
  
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: User = {
        id: `member-${Date.now()}`,
        name: newMemberName.trim()
      };
      
      setMembers([...members, newMember]);
      setNewMemberName("");
    }
  };
  
  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
  };
  
  const handleCreateGroup = () => {
    if (groupName.trim()) {
      const newGroup = createGroup(groupName.trim(), members);
      navigate(`/groups/${newGroup.id}`);
    }
  };
  
  return (
    <>
      <PageHeader 
        title="Create Group" 
        backTo="/"
      />
      
      <div className="p-4">
        <div className="mb-6">
          <Label htmlFor="group-name">Group Name</Label>
          <Input
            id="group-name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Trip to Goa"
            className="mt-1"
          />
        </div>
        
        <div className="mb-6">
          <Label htmlFor="members">Members</Label>
          <div className="flex mt-1">
            <Input
              id="members"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className="flex-1"
            />
            <Button
              type="button"
              variant="expense"
              className="ml-2"
              onClick={handleAddMember}
              disabled={!newMemberName.trim()}
            >
              <PlusCircle size={18} />
            </Button>
          </div>
          
          <div className="mt-3">
            {members.length > 0 ? (
              <div className="space-y-2">
                {members.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span>{member.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No members added yet. You'll be automatically included.
              </p>
            )}
          </div>
        </div>
        
        <Button
          variant="expense"
          className="w-full"
          onClick={handleCreateGroup}
          disabled={!groupName.trim()}
        >
          Create Group
        </Button>
      </div>
    </>
  );
}
