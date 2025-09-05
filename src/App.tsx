import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Auth from "./pages/Auth";
import AddExpense from "./pages/AddExpense";
import AdminManagement from "./pages/AdminManagement";
import ExpenseApprovalDashboard from "./pages/ExpenseApprovalDashboard";
import PublicLanding from "./pages/PublicLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/welcome" element={<PublicLanding />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full bg-background">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/inbox" element={<Inbox />} />
                          <Route path="/add-expense" element={<AddExpense />} />
                          <Route path="/admin" element={<AdminManagement />} />
                          <Route path="/approvals" element={<ExpenseApprovalDashboard />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
