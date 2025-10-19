import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./config/aws-config";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import Meds from "./pages/Meds";
import InsuranceOverview from "./pages/insurance/InsuranceOverview";
import InsurancePlans from "./pages/insurance/InsurancePlans";
import InsuranceFAQ from "./pages/insurance/InsuranceFAQ";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/symptoms" element={<ProtectedRoute><Symptoms /></ProtectedRoute>} />
            <Route path="/meds" element={<ProtectedRoute><Meds /></ProtectedRoute>} />
            <Route path="/insurance" element={<ProtectedRoute><InsuranceOverview /></ProtectedRoute>} />
            <Route path="/insurance/plans" element={<ProtectedRoute><InsurancePlans /></ProtectedRoute>} />
            <Route path="/insurance/faq" element={<ProtectedRoute><InsuranceFAQ /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
