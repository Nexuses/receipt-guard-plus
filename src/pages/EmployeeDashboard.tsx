import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

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
  approved_at: string;
  rejection_reason: string;
  created_at: string;
  approved_by: string;
}

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load your expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitExpense = async (expenseId: string) => {
    setActionLoading(expenseId);
    try {
      const { error } = await supabase.rpc('submit_expense', {
        expense_id: expenseId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense submitted for approval",
      });

      fetchExpenses();
    } catch (error) {
      console.error('Error submitting expense:', error);
      toast({
        title: "Error",
        description: "Failed to submit expense",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    setActionLoading(expenseId);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)
        .eq('user_id', user?.id)
        .in('status', ['draft']);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });

      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reimbursed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'reimbursed':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const getExpensesByStatus = (status: string) => {
    return expenses.filter(expense => expense.status === status);
  };

  const ExpenseCard = ({ expense }: { expense: Expense }) => (
    <Card key={expense.id} className="border-l-4 border-l-primary">
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
            {getStatusIcon(expense.status)}
            <span className="ml-1">{expense.status}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium">{expense.category || 'Uncategorized'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(expense.expense_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {expense.description && (
          <div>
            <p className="text-muted-foreground text-sm">Description</p>
            <p className="text-sm">{expense.description}</p>
          </div>
        )}

        {expense.rejection_reason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
            <p className="text-sm text-red-700">{expense.rejection_reason}</p>
          </div>
        )}

        {expense.status === 'draft' && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => submitExpense(expense.id)}
              disabled={actionLoading === expense.id}
              className="flex-1"
            >
              {actionLoading === expense.id ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/add-expense?edit=${expense.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteExpense(expense.id)}
              disabled={actionLoading === expense.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {expense.status === 'submitted' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
            <Clock className="h-4 w-4" />
            Submitted on {new Date(expense.submitted_at).toLocaleDateString()}
          </div>
        )}

        {expense.status === 'approved' && expense.approved_at && (
          <div className="flex items-center gap-2 text-sm text-green-600 pt-4">
            <CheckCircle className="h-4 w-4" />
            Approved on {new Date(expense.approved_at).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading your expenses...</div>
      </div>
    );
  }

  const draftExpenses = getExpensesByStatus('draft');
  const submittedExpenses = getExpensesByStatus('submitted');
  const approvedExpenses = getExpensesByStatus('approved');
  const rejectedExpenses = getExpensesByStatus('rejected');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Expenses</h1>
          <p className="text-muted-foreground">Manage and track your expense submissions</p>
        </div>
        <Button onClick={() => navigate('/add-expense')}>
          <DollarSign className="h-4 w-4 mr-2" />
          Add New Expense
        </Button>
      </div>

      <Tabs defaultValue="draft" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Draft ({draftExpenses.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({submittedExpenses.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({approvedExpenses.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected ({rejectedExpenses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="draft" className="space-y-4">
          {draftExpenses.length > 0 ? (
            draftExpenses.map(expense => <ExpenseCard key={expense.id} expense={expense} />)
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Draft Expenses</CardTitle>
                <CardDescription>You don't have any draft expenses. Create a new one to get started.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedExpenses.length > 0 ? (
            submittedExpenses.map(expense => <ExpenseCard key={expense.id} expense={expense} />)
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Pending Expenses</CardTitle>
                <CardDescription>You don't have any expenses waiting for approval.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedExpenses.length > 0 ? (
            approvedExpenses.map(expense => <ExpenseCard key={expense.id} expense={expense} />)
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Approved Expenses</CardTitle>
                <CardDescription>You don't have any approved expenses yet.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedExpenses.length > 0 ? (
            rejectedExpenses.map(expense => <ExpenseCard key={expense.id} expense={expense} />)
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Rejected Expenses</CardTitle>
                <CardDescription>You don't have any rejected expenses.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;