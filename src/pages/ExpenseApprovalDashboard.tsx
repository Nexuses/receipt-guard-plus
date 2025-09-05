import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Expense {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  expense_date: string;
  status: string;
  submitted_at: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const ExpenseApprovalDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          profiles!expenses_user_id_fkey(full_name, email)
        `)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setExpenses((data as any) || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load pending expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (expenseId: string) => {
    setActionLoading(expenseId);
    try {
      const { error } = await supabase.rpc('approve_expense', {
        expense_id: expenseId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense approved successfully",
      });

      fetchExpenses();
    } catch (error) {
      console.error('Error approving expense:', error);
      toast({
        title: "Error",
        description: "Failed to approve expense",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectExpense = async (expenseId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(expenseId);
    try {
      const { error } = await supabase.rpc('reject_expense', {
        expense_id: expenseId,
        reason: reason.trim()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense rejected successfully",
      });

      setRejectionReason("");
      setSelectedExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast({
        title: "Error",
        description: "Failed to reject expense",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading pending expenses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending expense submissions</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {expenses.length} Pending
        </Badge>
      </div>

      <div className="grid gap-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {formatCurrency(expense.amount, expense.currency)}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium">
                    {expense.merchant}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(expense.status)}>
                  <Clock className="h-3 w-3 mr-1" />
                  {expense.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {expense.profiles?.full_name || expense.profiles?.email}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{expense.category || 'Uncategorized'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expense Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {new Date(expense.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {expense.description && (
                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p className="text-sm">{expense.description}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => approveExpense(expense.id)}
                  disabled={actionLoading === expense.id}
                  className="flex-1"
                  variant="default"
                >
                  {actionLoading === expense.id ? (
                    "Processing..."
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setSelectedExpense(expense.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Expense</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for rejecting this expense from {expense.profiles?.full_name || 'the employee'}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Expense Details:</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(expense.amount, expense.currency)} at {expense.merchant}
                        </p>
                      </div>
                      <Textarea
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setRejectionReason("");
                        setSelectedExpense(null);
                      }}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => rejectExpense(expense.id, rejectionReason)}
                        disabled={!rejectionReason.trim() || actionLoading === expense.id}
                      >
                        {actionLoading === expense.id ? "Processing..." : "Reject Expense"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {expenses.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              No Pending Expenses
            </CardTitle>
            <CardDescription>
              There are no expenses waiting for approval at this time.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ExpenseApprovalDashboard;