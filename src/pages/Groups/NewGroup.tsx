
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { TopNav } from '@/components/NavigationMenu';
import { useToast } from "@/hooks/use-toast";

interface NewGroupForm {
  groupName: string;
  description: string;
}

// Define a Group type to store in localStorage
interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

const NewGroup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<NewGroupForm>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: NewGroupForm) => {
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the group
      const groupId = Math.random().toString(36).substring(2, 11);
      
      // Create new group object
      const newGroup: Group = {
        id: groupId,
        name: data.groupName,
        description: data.description || "",
        members: ["You"], // Default member is the current user
        createdAt: new Date().toISOString(),
      };
      
      // Get existing groups from localStorage or initialize empty array
      const existingGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      
      // Add new group to the array
      const updatedGroups = [...existingGroups, newGroup];
      
      // Save updated groups array back to localStorage
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      
      // Show success toast
      toast({
        title: "Group Created",
        description: `"${data.groupName}" has been created successfully.`,
      });
      
      // Navigate to the new group page
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
        <Card className="w-full bg-card/50 backdrop-blur-sm border border-border/50 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
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
                  className="w-full transition-colors hover:border-primary/50 focus:border-primary"
                  placeholder="Enter group name"
                />
                {errors.groupName && (
                  <p className="text-sm text-red-500">{errors.groupName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  {...register("description")}
                  className="w-full transition-colors hover:border-primary/50 focus:border-primary"
                  placeholder="Enter group description"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full hover:bg-background/50 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
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
