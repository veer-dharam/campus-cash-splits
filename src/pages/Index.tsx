
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Plus, Users } from "lucide-react";
import { TopNav } from "@/components/NavigationMenu";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    navigate("/groups/new");
  };

  const handleJoinGroup = () => {
    navigate("/groups/join");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-start space-y-6 max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Campus Cash Splits
          </h1>
          <p className="text-muted-foreground text-lg">
            Split expenses effortlessly with your campus mates
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
            <Card className="group bg-card hover:bg-accent transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-2 group-hover:text-accent-foreground"
                  onClick={handleCreateGroup}
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Group</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="group bg-card hover:bg-accent transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-2 group-hover:text-accent-foreground"
                  onClick={handleJoinGroup}
                >
                  <Users className="h-5 w-5" />
                  <span>Join Existing Group</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Groups */}
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Groups</h2>
            <div className="grid grid-cols-1 gap-4">
              <Card className="group bg-card hover:bg-accent transition-all duration-300">
                <CardContent className="p-6">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start group-hover:text-accent-foreground"
                    onClick={() => navigate("/groups/1")}
                  >
                    <div className="flex items-center space-x-4">
                      <Home className="h-5 w-5" />
                      <div className="text-left">
                        <h3 className="font-medium">Apartment Expenses</h3>
                        <p className="text-sm text-muted-foreground">4 members</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
