export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'employee' | 'manager' | 'finance_admin' | 'observer';
  department?: string;
}

export interface Expense {
  id: string;
  userId: string;
  date: Date;
  merchant: string;
  amount: {
    value: number;
    currency: string;
  };
  categoryId: string;
  source: 'email' | 'sms' | 'receipt' | 'bank_statement' | 'manual' | 'api';
  receiptUrl?: string;
  description: string;
  reimbursable: boolean;
  policyFlags: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'reimbursed';
  assigneeId?: string;
  duplicates: string[];
  confidence: 'high' | 'medium' | 'low';
  history: ExpenseHistoryItem[];
  tags: string[];
  notes?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

export interface ExpenseHistoryItem {
  id: string;
  action: string;
  actorId: string;
  timestamp: Date;
  details?: any;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  isActive: boolean;
  children?: Category[];
}

export interface Rule {
  id: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  enabled: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'regex';
  value: string | number;
}

export interface RuleAction {
  type: 'set_category' | 'set_reimbursable' | 'assign_to' | 'add_flag' | 'require_approval';
  value: string | boolean;
}

export interface Approval {
  id: string;
  expenseId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  note?: string;
  requestedAt: Date;
  respondedAt?: Date;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface AuditEvent {
  id: string;
  actorId: string;
  action: string;
  entityType: 'expense' | 'rule' | 'category' | 'user' | 'approval';
  entityId: string;
  metadata: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface DashboardMetrics {
  totalSpend: {
    current: number;
    previous: number;
    change: number;
  };
  unreviewed: number;
  autoMatched: number;
  violations: number;
  reimbursementQueue: number;
  avgProcessingTime: number;
}

export interface ExpenseFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  categories?: string[];
  merchants?: string[];
  assignees?: string[];
  sources?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  searchQuery?: string;
}