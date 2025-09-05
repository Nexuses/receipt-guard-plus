import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { KPICard } from "@/components/dashboard/KPICard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard,
  TrendingUp,
  Plus,
  Upload,
  Zap,
  Users,
  Crown,
  PieChart,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import heroImage from "@/assets/hero-dashboard.jpg";

interface DashboardStats {
  totalSpent: number;
  pendingExpenses: number;
  approvedExpenses: number;
  rejectedExpenses: number;
  thisMonthSpend: number;
  expensesByCategory: { name: string; value: number; color: string }[];
  monthlySpending: { month: string; amount: number }[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSpent: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0,
    thisMonthSpend: 0,
    expensesByCategory: [],
    monthlySpending: []
  });
  const { toast } = useToast();

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Fetch expenses (all for admin, own for employee)
      const expensesQuery = supabase
        .from('expenses')
        .select('*');
      
      if (!isAdmin) {
        expensesQuery.eq('user_id', user.id);
      }

      const { data: expenses, error } = await expensesQuery;
      
      if (error) throw error;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Calculate stats
      const totalSpent = expenses?.reduce((sum, expense) => 
        expense.status === 'approved' ? sum + Number(expense.amount) : sum, 0) || 0;
      
      const pendingExpenses = expenses?.filter(e => e.status === 'submitted').length || 0;
      const approvedExpenses = expenses?.filter(e => e.status === 'approved').length || 0;
      const rejectedExpenses = expenses?.filter(e => e.status === 'rejected').length || 0;
      
      const thisMonthSpend = expenses?.filter(expense => {
        const expenseDate = new Date(expense.expense_date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear &&
               expense.status === 'approved';
      }).reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      // Category breakdown
      const categoryTotals: { [key: string]: number } = {};
      expenses?.forEach(expense => {
        if (expense.status === 'approved') {
          const category = expense.category || 'Other';
          categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
        }
      });

      const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];
      const expensesByCategory = Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));

      // Monthly spending (last 6 months)
      const monthlySpending = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        
        const monthlyTotal = expenses?.filter(expense => {
          const expenseDate = new Date(expense.expense_date);
          return expenseDate.getMonth() === date.getMonth() && 
                 expenseDate.getFullYear() === date.getFullYear() &&
                 expense.status === 'approved';
        }).reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
        
        monthlySpending.push({ month, amount: monthlyTotal });
      }

      setStats({
        totalSpent,
        pendingExpenses,
        approvedExpenses,
        rejectedExpenses,
        thisMonthSpend,
        expensesByCategory,
        monthlySpending
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDummyExpenses = async () => {
    if (!user) return;

    const dummyExpenses = [
      { merchant: 'Starbucks', amount: 12.50, category: 'Meals', description: 'Morning coffee' },
      { merchant: 'Uber', amount: 25.30, category: 'Travel', description: 'Ride to client meeting' },
      { merchant: 'Office Depot', amount: 89.99, category: 'Office Supplies', description: 'Printer paper and supplies' },
      { merchant: 'Amazon', amount: 45.00, category: 'Equipment', description: 'Wireless mouse' },
      { merchant: 'Shell Gas Station', amount: 60.00, category: 'Travel', description: 'Fuel for business trip' },
      { merchant: 'Best Buy', amount: 199.99, category: 'Equipment', description: 'External monitor' },
      { merchant: 'Subway', amount: 8.75, category: 'Meals', description: 'Lunch meeting' },
      { merchant: 'FedEx Office', amount: 15.20, category: 'Office Supplies', description: 'Document printing' }
    ];

    try {
      const expensesToInsert = dummyExpenses.map(expense => ({
        ...expense,
        user_id: user.id,
        expense_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: Math.random() > 0.7 ? 'approved' : Math.random() > 0.5 ? 'submitted' : 'draft',
        currency: 'USD',
        source: 'manual'
      }));

      const { error } = await supabase
        .from('expenses')
        .insert(expensesToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Added 8 dummy expenses for testing",
      });

      fetchDashboardStats();
    } catch (error) {
      console.error('Error creating dummy expenses:', error);
      toast({
        title: "Error",
        description: "Failed to create dummy expenses",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  useEffect(() => {
    checkUserRole();
  }, [user]);

  useEffect(() => {
    fetchDashboardStats();
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-6 bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-xl">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                {isAdmin ? 'Admin Dashboard' : 'Good morning!'}
              </h1>
              <p className="text-primary-foreground/90 text-lg max-w-2xl">
                {isAdmin ? (
                  <>You have <span className="font-semibold text-warning">{stats.pendingExpenses} expenses</span> awaiting approval across all employees.</>
                ) : (
                  <>You have <span className="font-semibold text-warning">{stats.pendingExpenses} expenses</span> pending approval and spent <span className="font-semibold text-success">{formatCurrency(stats.thisMonthSpend)}</span> this month.</>
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="enterprise-button shadow-lg" onClick={createDummyExpenses}>
                <Upload className="h-4 w-4 mr-2" />
                Add Dummy Data
              </Button>
              <Button 
                variant="outline" 
                className="enterprise-button text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 bg-white/10 backdrop-blur-sm shadow-lg"
                onClick={() => window.location.href = '/add-expense'}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Expense
              </Button>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="enterprise-button text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 bg-white/10 backdrop-blur-sm shadow-lg"
                  onClick={() => window.location.href = '/approvals'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Expenses
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={isAdmin ? "Total Company Spend" : "Total Spend"}
          value={formatCurrency(stats.totalSpent)}
          change={{
            value: 12.5,
            type: 'increase',
            period: 'last month'
          }}
          icon={<DollarSign className="h-4 w-4" />}
          trend={{
            data: [20, 30, 25, 40, 35, 50, 45],
            positive: true
          }}
        />
        
        <KPICard
          title={isAdmin ? "Pending Approvals" : "Pending Expenses"}
          value={stats.pendingExpenses.toString()}
          icon={<Clock className="h-4 w-4" />}
          badge={stats.pendingExpenses > 0 ? {
            text: 'Action Required',
            variant: 'destructive'
          } : undefined}
          description={isAdmin ? "Requires your approval" : "Awaiting approval"}
        />
        
        <KPICard
          title="Approved Expenses"
          value={stats.approvedExpenses.toString()}
          change={{
            value: 8.2,
            type: 'increase',
            period: 'last week'
          }}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Successfully processed"
        />
        
        <KPICard
          title="This Month"
          value={formatCurrency(stats.thisMonthSpend)}
          icon={<CreditCard className="h-4 w-4" />}
          description="Current month spending"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Spending Chart - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="expense-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Spending Trend
              </CardTitle>
              <CardDescription>Last 6 months spending overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="amount" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {isAdmin && (
                  <Button variant="outline" className="h-auto p-4 justify-start enterprise-button" onClick={() => window.location.href = '/approvals'}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Review Expenses</div>
                        <div className="text-sm text-muted-foreground">{stats.pendingExpenses} pending</div>
                      </div>
                    </div>
                  </Button>
                )}
                
                <Button variant="outline" className="h-auto p-4 justify-start enterprise-button" onClick={() => window.location.href = '/add-expense'}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Add Expense</div>
                      <div className="text-sm text-muted-foreground">Create new expense</div>
                    </div>
                  </div>
                </Button>
                
                {isAdmin && (
                  <Button variant="outline" className="h-auto p-4 justify-start enterprise-button" onClick={() => window.location.href = '/admin'}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Crown className="h-5 w-5 text-warning" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">User Management</div>
                        <div className="text-sm text-muted-foreground">Manage admins</div>
                      </div>
                    </div>
                  </Button>
                )}
                
                <Button variant="outline" className="h-auto p-4 justify-start enterprise-button" onClick={createDummyExpenses}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-info" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Import Test Data</div>
                      <div className="text-sm text-muted-foreground">Add sample expenses</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Category Chart and Activity */}
        <div className="space-y-6">
          {/* Category Breakdown */}
          <Card className="expense-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.expensesByCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={stats.expensesByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {stats.expensesByCategory.map((category, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(category.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No expense data yet</p>
                  <p className="text-sm">Add some expenses to see category breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;