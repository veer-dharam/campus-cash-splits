
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewGroup from "./pages/Groups/NewGroup";
import Group from "./pages/Groups/Group";
import AddExpense from "./pages/Expenses/AddExpense";
import Balances from "./pages/Balances/Balances";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/groups/new" element={<NewGroup />} />
              <Route path="/groups/:id" element={<Group />} />
              <Route path="/expenses/new" element={<AddExpense />} />
              <Route path="/balances" element={<Balances />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
