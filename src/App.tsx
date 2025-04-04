import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

// Pages
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import VoiceClone from "./pages/VoiceClone";
import Calls from "./pages/Calls";
import Customers from "./pages/Customers";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import { Button } from "./components/ui/button";

// Create a client
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        
      <Routes>
      
      <Route path="/" element={<LandingPage />} />
      
     
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      
      <Route path="/voice-clone" element={
        <ProtectedRoute>
          <VoiceClone />
        </ProtectedRoute>
      } />
      
      <Route path="/calls" element={
        <ProtectedRoute>
          <Calls />
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      } />
      
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      
      <Route path="/upload-doc" element={
        <ProtectedRoute>
          <DocumentUploadPage />
        </ProtectedRoute>
      } />
      
  
      <Route path="*" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />
    </Routes>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



// get a number
// 