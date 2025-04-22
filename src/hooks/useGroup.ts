
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  createdAt: string;
}

export const useGroup = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadGroupAndExpenses = () => {
    try {
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const foundGroup = storedGroups.find((g: Group) => g.id === id);
      
      if (foundGroup) {
        setGroup(foundGroup);
        const storedExpenses = JSON.parse(localStorage.getItem(`expenses-${id}`) || '[]');
        setExpenses(storedExpenses);
      } else {
        toast({
          title: "Group not found",
          description: "The requested group could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Error loading group:", error);
      toast({
        title: "Error",
        description: "Failed to load group data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = () => {
    try {
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const updatedGroups = storedGroups.filter((g: Group) => g.id !== id);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      localStorage.removeItem(`expenses-${id}`);
      
      toast({
        title: "Group Deleted",
        description: "The group has been deleted successfully.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Error",
        description: "Failed to delete the group.",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = (newMember: string) => {
    if (group) {
      const updatedGroup = {
        ...group,
        members: [...group.members, newMember]
      };
      
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const updatedGroups = storedGroups.map((g: Group) => 
        g.id === id ? updatedGroup : g
      );
      
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      setGroup(updatedGroup);
      
      toast({
        title: "Member Added",
        description: `${newMember} has been added to the group.`,
      });
    }
  };

  useEffect(() => {
    loadGroupAndExpenses();
  }, [id, navigate, toast]);

  return {
    group,
    loading,
    expenses,
    setExpenses,
    handleDeleteGroup,
    handleAddMember
  };
};
