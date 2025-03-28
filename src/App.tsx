import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// Pages
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import VoiceClone from "./pages/VoiceClone";
import Calls from "./pages/Calls";
import Customers from "./pages/Customers";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/voice-clone" element={<VoiceClone />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/calendar" element={<Calendar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
