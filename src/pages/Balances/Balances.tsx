
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopNav } from '@/components/NavigationMenu';

interface Balance {
  person: string;
  amount: number;
}

const balances: Balance[] = [
  { person: "Rahul", amount: -1000 },
  { person: "Aarav", amount: 150 },
  { person: "Priya", amount: -100 },
];

const Balances = () => {
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
          <h1 className="text-2xl font-semibold">Balances</h1>
        </div>

        <div className="space-y-4">
          {balances.map((balance) => (
            <Card key={balance.person} className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">
                  {balance.amount < 0 ? `You owe ${balance.person}` : `${balance.person} owes you`}
                </span>
                <span className={`font-semibold ${balance.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹{Math.abs(balance.amount)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Balances;
