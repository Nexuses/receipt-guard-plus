import { KPICard } from "@/components/dashboard/KPICard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardMetrics, formatCurrency } from "@/lib/data";
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard,
  TrendingUp,
  Plus,
  Upload,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

export default function Dashboard() {
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
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Good morning!</h1>
              <p className="text-primary-foreground/90 text-lg max-w-2xl">
                You have <span className="font-semibold text-warning">{dashboardMetrics.unreviewed} expenses</span> awaiting review and <span className="font-semibold text-destructive">{dashboardMetrics.violations} policy violations</span> to address.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="enterprise-button shadow-lg">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Button 
                variant="outline" 
                className="enterprise-button text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 bg-white/10 backdrop-blur-sm shadow-lg"
                onClick={() => window.location.href = '/add-expense'}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Expense
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Spend (MTD)"
          value={formatCurrency(dashboardMetrics.totalSpend.current)}
          change={{
            value: dashboardMetrics.totalSpend.change,
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
          title="Unreviewed Items"
          value={dashboardMetrics.unreviewed}
          icon={<Clock className="h-4 w-4" />}
          badge={{
            text: 'Action Required',
            variant: 'destructive'
          }}
          description="Requires immediate attention"
        />
        
        <KPICard
          title="Auto-matched"
          value={dashboardMetrics.autoMatched}
          change={{
            value: 15.2,
            type: 'increase',
            period: 'last week'
          }}
          icon={<CheckCircle className="h-4 w-4" />}
          description="High confidence matches"
        />
        
        <KPICard
          title="Policy Violations"
          value={dashboardMetrics.violations}
          icon={<AlertTriangle className="h-4 w-4" />}
          badge={{
            text: 'Review',
            variant: 'destructive'
          }}
          description="Require manager approval"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-auto p-4 justify-start enterprise-button">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Auto-categorize</div>
                      <div className="text-sm text-muted-foreground">Process pending items</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start enterprise-button">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Bulk Approve</div>
                      <div className="text-sm text-muted-foreground">Review high-confidence</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start enterprise-button">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Review Violations</div>
                      <div className="text-sm text-muted-foreground">{dashboardMetrics.violations} items</div>
                    </div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start enterprise-button">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-info" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Process Reimbursements</div>
                      <div className="text-sm text-muted-foreground">{dashboardMetrics.reimbursementQueue} pending</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Expenses Preview */}
          <Card className="expense-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Expenses</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { merchant: 'Starbucks', amount: 12.50, status: 'approved', date: '2024-01-20' },
                  { merchant: 'Uber', amount: 45.30, status: 'pending', date: '2024-01-19' },
                  { merchant: 'Office Depot', amount: 89.99, status: 'flagged', date: '2024-01-18' },
                ].map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{expense.merchant}</div>
                        <div className="text-sm text-muted-foreground">{expense.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${expense.amount}</div>
                      <Badge 
                        className={
                          expense.status === 'approved' ? 'status-badge-approved' :
                          expense.status === 'pending' ? 'status-badge-pending' :
                          'status-badge-rejected'
                        }
                      >
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <ActivityTimeline />
          
          {/* Performance Metrics */}
          <Card className="expense-card">
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                <span className="font-medium">{dashboardMetrics.avgProcessingTime} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auto-categorization Rate</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Policy Compliance</span>
                <span className="font-medium text-success">94%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}