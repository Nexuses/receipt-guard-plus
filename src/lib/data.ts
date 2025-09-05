import { Expense, Category, Rule, User, Approval, AuditEvent, DashboardMetrics } from '@/types/expense';

// Mock users
export const users: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'finance_admin', department: 'Finance', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'manager', department: 'Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: '3', name: 'Emily Johnson', email: 'emily.j@company.com', role: 'employee', department: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
  { id: '4', name: 'David Kim', email: 'david.kim@company.com', role: 'employee', department: 'Sales', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: '5', name: 'Jessica Thompson', email: 'jessica.t@company.com', role: 'manager', department: 'Operations', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
];

// Mock categories
export const categories: Category[] = [
  { id: '1', name: 'Meals & Entertainment', color: '#10b981', isActive: true },
  { id: '2', name: 'Travel', color: '#3b82f6', isActive: true },
  { id: '3', name: 'Office Supplies', color: '#8b5cf6', isActive: true },
  { id: '4', name: 'Software & Subscriptions', color: '#f59e0b', isActive: true },
  { id: '5', name: 'Training & Education', color: '#ef4444', isActive: true },
  { id: '6', name: 'Marketing', color: '#06b6d4', isActive: true },
  { id: '7', name: 'Equipment', color: '#84cc16', isActive: true },
  { id: '8', name: 'Professional Services', color: '#f97316', isActive: true },
];

// Mock rules
export const rules: Rule[] = [
  {
    id: '1',
    name: 'Auto-categorize Uber/Lyft',
    conditions: [
      { field: 'merchant', operator: 'contains', value: 'uber' },
      { field: 'merchant', operator: 'contains', value: 'lyft' }
    ],
    actions: [
      { type: 'set_category', value: '2' },
      { type: 'set_reimbursable', value: true }
    ],
    priority: 1,
    enabled: true,
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Flag large meals',
    conditions: [
      { field: 'category', operator: 'equals', value: '1' },
      { field: 'amount', operator: 'greater_than', value: 100 }
    ],
    actions: [
      { type: 'add_flag', value: 'large_meal' },
      { type: 'require_approval', value: true }
    ],
    priority: 2,
    enabled: true,
    createdBy: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

// Generate mock expenses
const merchants = [
  'Uber', 'Lyft', 'Starbucks', 'Amazon', 'Office Depot', 'Delta Airlines', 
  'Hilton Hotels', 'Shell', 'Best Buy', 'Adobe', 'Zoom', 'Slack',
  'McDonald\'s', 'Chipotle', 'FedEx', 'United Airlines', 'Marriott',
  'WeWork', 'GitHub', 'Figma', 'Notion', 'Salesforce'
];

const descriptions = [
  'Team lunch meeting', 'Client dinner', 'Office supplies purchase', 
  'Software subscription', 'Conference attendance', 'Travel accommodation',
  'Taxi to airport', 'Training materials', 'Marketing campaign',
  'Equipment purchase', 'Professional consultation', 'Networking event'
];

function generateRandomExpense(id: string): Expense {
  const merchant = merchants[Math.floor(Math.random() * merchants.length)];
  const amount = Math.floor(Math.random() * 500) + 10;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  const statuses: Expense['status'][] = ['draft', 'pending', 'approved', 'rejected'];
  const sources: Expense['source'][] = ['email', 'receipt', 'bank_statement', 'manual'];
  const confidences: Expense['confidence'][] = ['high', 'medium', 'low'];
  
  return {
    id,
    userId: users[Math.floor(Math.random() * users.length)].id,
    date,
    merchant,
    amount: { value: amount, currency: 'USD' },
    categoryId: categories[Math.floor(Math.random() * categories.length)].id,
    source: sources[Math.floor(Math.random() * sources.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    reimbursable: Math.random() > 0.3,
    policyFlags: Math.random() > 0.8 ? ['large_meal'] : [],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    duplicates: Math.random() > 0.9 ? [`dup-${id}`] : [],
    confidence: confidences[Math.floor(Math.random() * confidences.length)],
    history: [],
    tags: [],
    submittedAt: date
  };
}

export const expenses: Expense[] = Array.from({ length: 200 }, (_, i) => 
  generateRandomExpense((i + 1).toString())
);

// Mock dashboard metrics
export const dashboardMetrics: DashboardMetrics = {
  totalSpend: {
    current: 45620,
    previous: 38940,
    change: 17.2
  },
  unreviewed: 23,
  autoMatched: 187,
  violations: 5,
  reimbursementQueue: 12,
  avgProcessingTime: 2.4
};

// Helper functions
export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getExpensesByUserId(userId: string): Expense[] {
  return expenses.filter(expense => expense.userId === userId);
}

export function getExpensesByStatus(status: Expense['status']): Expense[] {
  return expenses.filter(expense => expense.status === status);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getConfidenceColor(confidence: Expense['confidence']): string {
  switch (confidence) {
    case 'high': return 'confidence-high';
    case 'medium': return 'confidence-medium';
    case 'low': return 'confidence-low';
    default: return 'muted';
  }
}

export function getStatusColor(status: Expense['status']): string {
  switch (status) {
    case 'approved': return 'status-approved';
    case 'pending': return 'status-pending';
    case 'rejected': return 'status-rejected';
    case 'draft': return 'status-draft';
    default: return 'muted';
  }
}