import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Zap, 
  Shield, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export default function PublicLanding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automated Processing",
      description: "AI-powered expense categorization and duplicate detection"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Policy Compliance",
      description: "Built-in policy enforcement and violation detection"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics", 
      description: "Real-time spending insights and detailed reporting"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Streamlined Approval",
      description: "Efficient approval workflows for managers and finance teams"
    }
  ];

  const stats = [
    { label: "Processing Time Reduced", value: "75%", icon: <Clock className="h-5 w-5" /> },
    { label: "Policy Compliance", value: "94%", icon: <Shield className="h-5 w-5" /> },
    { label: "Cost Savings", value: "$50K+", icon: <DollarSign className="h-5 w-5" /> },
    { label: "User Satisfaction", value: "98%", icon: <CheckCircle className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExpenseFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="enterprise-button">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="px-4 py-2">
            🚀 Enterprise Expense Automation Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Automate Your <span className="text-gradient">Expense Management</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Streamline expense reporting, enforce policies automatically, and gain real-time insights into your organization's spending patterns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="enterprise-button text-lg px-8 py-6"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="expense-card text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for enterprise teams who need powerful expense management without the complexity
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="expense-card hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="expense-card bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Expense Management?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of companies who've automated their expense workflows with ExpenseFlow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6"
              >
                Start Your Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <CreditCard className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold">ExpenseFlow</span>
          </div>
          <p>&copy; 2024 ExpenseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}