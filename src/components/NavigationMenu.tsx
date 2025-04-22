
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";

export function TopNav() {
  const navigate = useNavigate();

  return (
    <div className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Menu className="h-5 w-5" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-48 gap-2 p-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-accent/50 transition-colors duration-200" 
                    onClick={() => navigate('/')}
                  >
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-accent/50 transition-colors duration-200" 
                    onClick={() => navigate('/groups/new')}
                  >
                    New Group
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-accent/50 transition-colors duration-200" 
                    onClick={() => navigate('/expenses')}
                  >
                    Expenses
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-accent/50 transition-colors duration-200" 
                    onClick={() => navigate('/balances')}
                  >
                    Balances
                  </Button>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
