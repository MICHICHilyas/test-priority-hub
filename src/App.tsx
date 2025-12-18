import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import Coverage from "./pages/Coverage";
import TestGenerator from "./pages/TestGenerator";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/coverage" element={<Coverage />} />
            <Route path="/risks" element={<Dashboard />} />
            <Route path="/trends" element={<Dashboard />} />
            <Route path="/impact" element={<Dashboard />} />
            <Route path="/debt" element={<Dashboard />} />
            <Route path="/flaky" element={<Dashboard />} />
            <Route path="/test-generator" element={<TestGenerator />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
