import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/sources" element={<div className="p-6">Sources - Coming Soon</div>} />
                  <Route path="/rules" element={<div className="p-6">Rules - Coming Soon</div>} />
                  <Route path="/approvals" element={<div className="p-6">Approvals - Coming Soon</div>} />
                  <Route path="/reports" element={<div className="p-6">Reports - Coming Soon</div>} />
                  <Route path="/users" element={<div className="p-6">Users - Coming Soon</div>} />
                  <Route path="/audit" element={<div className="p-6">Audit - Coming Soon</div>} />
                  <Route path="/settings" element={<div className="p-6">Settings - Coming Soon</div>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
