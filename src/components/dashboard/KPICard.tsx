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
    <Card className="expense-card group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card via-card to-card/90">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground/80">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-200">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            {change && (
              <div className="flex items-center space-x-1 text-sm">
                {change.type === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={`font-medium ${change.type === 'increase' ? 'text-success' : 'text-destructive'}`}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                <span className="text-muted-foreground">vs {change.period}</span>
              </div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground/80">{description}</p>
            )}
          </div>
          {badge && (
            <Badge variant={badge.variant} className="text-xs px-2 py-1 shadow-sm">
              {badge.text}
            </Badge>
          )}
        </div>
        
        {/* Enhanced mini trend chart */}
        {trend && (
          <div className="space-y-2">
            <div className="h-12 flex items-end justify-between gap-1">
              {trend.data.map((point, index) => (
                <div
                  key={index}
                  className={`flex-1 max-w-[8px] rounded-t-sm transition-all duration-300 hover:opacity-80 ${
                    trend.positive 
                      ? 'bg-gradient-to-t from-success/60 to-success/30' 
                      : 'bg-gradient-to-t from-destructive/60 to-destructive/30'
                  }`}
                  style={{ height: `${Math.max(4, (point / Math.max(...trend.data)) * 100)}%` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>7 days</span>
              <span className={trend.positive ? 'text-success' : 'text-destructive'}>
                {trend.positive ? '↗' : '↘'} Trending {trend.positive ? 'up' : 'down'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}