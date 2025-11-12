import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Business from "./pages/Business";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import CallAgent from "./pages/CallAgent";
import ReferralGenerator from "./pages/ReferralGenerator";
import Affiliate from "./pages/Affiliate";
import Promoter from "./pages/Promoter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/business" element={<Business />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/agent" element={<CallAgent />} />
          <Route path="/referrals" element={<ReferralGenerator />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/promoter" element={<Promoter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
