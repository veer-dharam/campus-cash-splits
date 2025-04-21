
import { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
          <main className="pb-16">
            {children}
          </main>
          {isMobile && <MobileNavigation />}
        </div>
      </div>
      <Toaster />
    </AppProvider>
  );
}
