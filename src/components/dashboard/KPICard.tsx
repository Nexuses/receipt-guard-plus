import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: ReactNode;
  description?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  trend?: {
    data: number[];
    positive: boolean;
  };
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon, 
  description, 
  badge,
  trend 
}: KPICardProps) {
  return (
    <Card className="kpi-card group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div className="flex items-center text-xs text-muted-foreground">
                {change.type === 'increase' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                )}
                <span className={change.type === 'increase' ? 'text-success' : 'text-destructive'}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                <span className="ml-1">from {change.period}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {badge && (
            <Badge variant={badge.variant} className="ml-auto">
              {badge.text}
            </Badge>
          )}
        </div>
        
        {/* Mini trend chart placeholder */}
        {trend && (
          <div className="mt-4 h-8 flex items-end space-x-1">
            {trend.data.map((point, index) => (
              <div
                key={index}
                className={`w-2 rounded-sm transition-all ${
                  trend.positive ? 'bg-success/30 hover:bg-success/50' : 'bg-destructive/30 hover:bg-destructive/50'
                }`}
                style={{ height: `${(point / Math.max(...trend.data)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}