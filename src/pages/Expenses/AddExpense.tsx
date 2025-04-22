
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TopNav } from '@/components/NavigationMenu';

const participants = ["You", "Rahul", "Aarav", "Priya"];

const AddExpense = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6 gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Add Expense</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Paid by</Label>
              <Input placeholder="Select who paid" defaultValue="You" />
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input 
                type="number" 
                placeholder="₹"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="What was this expense for?" />
            </div>

            <div className="space-y-2">
              <Label>Split between</Label>
              <div className="flex flex-wrap gap-2">
                {participants.map((person) => (
                  <Button
                    key={person}
                    variant={person === "You" ? "default" : "outline"}
                    className="rounded-full"
                  >
                    {person}
                  </Button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={() => navigate(-1)}>
              Done
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;
