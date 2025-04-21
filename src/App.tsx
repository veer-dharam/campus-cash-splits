import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import GroupPage from "./pages/GroupPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import AddExpensePage from "./pages/AddExpensePage";
import BalancesPage from "./pages/BalancesPage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/groups/new" element={<CreateGroupPage />} />
            <Route path="/groups/:groupId" element={<GroupPage />} />
            <Route path="/groups/:groupId/expenses/add" element={<AddExpensePage />} />
            <Route path="/groups/:groupId/balances" element={<BalancesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
