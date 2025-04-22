
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { TopNav } from '@/components/NavigationMenu';

interface NewGroupForm {
  groupName: string;
  description: string;
}

const NewGroup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<NewGroupForm>();

  const onSubmit = (data: NewGroupForm) => {
    console.log('New group data:', data);
    navigate('/groups/' + Math.random().toString(36).substr(2, 9));
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
                  {...register("groupName", { required: true })}
                  className="w-full transition-colors hover:border-primary/50 focus:border-primary"
                  placeholder="Enter group name"
                />
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
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
                >
                  Create Group
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
