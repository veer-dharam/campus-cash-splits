
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { TopNav } from '@/components/NavigationMenu';
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from 'lucide-react';

interface NewGroupForm {
  groupName: string;
  description: string;
}

interface Member {
  name: string;
  id: string;
}

const NewGroup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<NewGroupForm>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<Member[]>([{ name: 'You', id: 'user-1' }]);
  const [newMember, setNewMember] = useState('');

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([...members, { 
        name: newMember.trim(), 
        id: `member-${Date.now()}`
      }]);
      setNewMember('');
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const onSubmit = (data: NewGroupForm) => {
    setIsSubmitting(true);
    
    try {
      const groupId = Math.random().toString(36).substring(2, 11);
      
      const newGroup = {
        id: groupId,
        name: data.groupName,
        description: data.description || "",
        members: members.map(m => m.name),
        createdAt: new Date().toISOString(),
      };
      
      const existingGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const updatedGroups = [...existingGroups, newGroup];
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      
      toast({
        title: "Group Created",
        description: `"${data.groupName}" has been created successfully.`,
      });
      
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="w-full bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Create a New Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  {...register("groupName", { required: "Group name is required" })}
                  className="w-full"
                  placeholder="Enter group name"
                />
                {errors.groupName && (
                  <p className="text-sm text-destructive">{errors.groupName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  {...register("description")}
                  className="w-full"
                  placeholder="Enter group description"
                />
              </div>

              <div className="space-y-4">
                <Label>Members</Label>
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full"
                    >
                      <span>{member.name}</span>
                      {member.name !== 'You' && (
                        <button
                          type="button"
                          onClick={() => removeMember(member.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
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
                    type="button"
                    onClick={addMember}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewGroup;
