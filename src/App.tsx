import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

// Pages
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SignedOut>
          {/* Render Clerk's SignIn/SignUp form */}
          <div className="flex items-center justify-center h-screen">
            <SignInButton mode="modal">
              <Button>Sign In / Sign Up</Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
            </SignedIn>
          </header>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/voice-clone" element={<VoiceClone />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/upload-doc" element={<DocumentUploadPage />} />
            {/* ADD ALL CUSTOM ROUTES BELOW THE CATCH-ALL "*" ROUTE */}
            {/* Example: <Route path="/example" element={<Example />} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SignedIn>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



// get a number
// 