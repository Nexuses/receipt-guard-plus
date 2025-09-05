import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertTriangle, Upload, Zap } from "lucide-react";

interface TimelineItem {
  id: string;
  type: 'approval' | 'rejection' | 'auto_categorization' | 'upload' | 'policy_violation';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: any;
}

const mockTimelineData: TimelineItem[] = [
  {
    id: '1',
    type: 'approval',
    title: 'Expense Approved',
    description: 'Team lunch at Starbucks - $45.67',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    user: { name: 'Michael Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' }
  },
  {
    id: '2',
    type: 'auto_categorization',
    title: 'Auto-categorized',
    description: '15 expenses categorized as Travel',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    type: 'upload',
    title: 'Receipts Uploaded',
    description: 'Bank statement imported - 25 new expenses',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    user: { name: 'Emily Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' }
  },
  {
    id: '4',
    type: 'policy_violation',
    title: 'Policy Violation',
    description: 'Meal expense exceeds daily limit',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    user: { name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
  },
  {
    id: '5',
    type: 'rejection',
    title: 'Expense Rejected',
    description: 'Missing receipt for office supplies',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    user: { name: 'Jessica Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' }
  }
];

function getTimelineIcon(type: TimelineItem['type']) {
  switch (type) {
    case 'approval':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'rejection':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'auto_categorization':
      return <Zap className="h-4 w-4 text-warning" />;
    case 'upload':
      return <Upload className="h-4 w-4 text-info" />;
    case 'policy_violation':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

function getTimelineBadge(type: TimelineItem['type']) {
  switch (type) {
    case 'approval':
      return <Badge className="status-badge-approved">Approved</Badge>;
    case 'rejection':
      return <Badge className="status-badge-rejected">Rejected</Badge>;
    case 'auto_categorization':
      return <Badge variant="outline">Automated</Badge>;
    case 'upload':
      return <Badge variant="secondary">Upload</Badge>;
    case 'policy_violation':
      return <Badge className="status-badge-rejected">Violation</Badge>;
    default:
      return null;
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
}

export function ActivityTimeline() {
  return (
    <Card className="expense-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Activity
          <Badge variant="outline" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTimelineData.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTimelineIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.title}</p>
                    {getTimelineBadge(item.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {item.user && (
                      <>
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={item.user.avatar} alt={item.user.name} />
                          <AvatarFallback className="text-[8px]">
                            {item.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{item.user.name}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
              {index < mockTimelineData.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}