
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function TopNav() {
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
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <NavigationMenuLink href="/groups">Groups</NavigationMenuLink>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <NavigationMenuLink href="/expenses">Expenses</NavigationMenuLink>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <NavigationMenuLink href="/balances">Balances</NavigationMenuLink>
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
