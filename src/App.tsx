import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import Meds from "./pages/Meds";
import InsuranceOverview from "./pages/insurance/InsuranceOverview";
import InsurancePlans from "./pages/insurance/InsurancePlans";
import InsuranceFAQ from "./pages/insurance/InsuranceFAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/meds" element={<Meds />} />
          <Route path="/insurance" element={<InsuranceOverview />} />
          <Route path="/insurance/plans" element={<InsurancePlans />} />
          <Route path="/insurance/faq" element={<InsuranceFAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
