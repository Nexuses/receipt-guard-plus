import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { expenses, users, categories, formatCurrency, formatDate, getUserById, getCategoryById } from "@/lib/data";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Check, 
  X, 
  Flag,
  Download,
  ArrowUpDown,
  Receipt
} from "lucide-react";

export default function Inbox() {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map(e => e.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'status-badge-pending',
      'approved': 'status-badge-approved',
      'rejected': 'status-badge-rejected',
      'draft': 'status-badge-draft'
    };
    return variants[status as keyof typeof variants] || 'status-badge-draft';
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      'high': 'confidence-high',
      'medium': 'confidence-medium',
      'low': 'confidence-low'
    };
    return variants[confidence as keyof typeof variants] || 'confidence-low';
  };

  const filteredExpenses = expenses.filter(expense => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      expense.merchant.toLowerCase().includes(query) ||
      expense.description.toLowerCase().includes(query) ||
      formatCurrency(expense.amount.value).toLowerCase().includes(query)
    );
  }).slice(0, 50); // Limit for demo

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Inbox</h1>
          <p className="text-muted-foreground">
            Review and process submitted expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="enterprise-button">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="expense-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Status
              </Button>
              <Button variant="outline" size="sm">
                Category
              </Button>
              <Button variant="outline" size="sm">
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedExpenses.length > 0 && (
        <Card className="expense-card border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedExpenses.length} item{selectedExpenses.length !== 1 ? 's' : ''} selected
                </span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="enterprise-button">
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="enterprise-button">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" className="enterprise-button">
                    <Flag className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedExpenses([])}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card className="expense-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Expenses ({filteredExpenses.length})</span>
            <Badge variant="outline">{expenses.filter(e => e.status === 'pending').length} pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedExpenses.length === filteredExpenses.length && filteredExpenses.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="sortable-header">
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="sortable-header">
                  <div className="flex items-center gap-2">
                    Merchant
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="sortable-header text-right">
                  <div className="flex items-center justify-end gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => {
                const user = getUserById(expense.userId);
                const category = getCategoryById(expense.categoryId);
                
                return (
                  <TableRow 
                    key={expense.id} 
                    className="data-row border-border/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedExpenses.includes(expense.id)}
                        onCheckedChange={() => handleSelectExpense(expense.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {expense.receiptUrl && (
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{expense.merchant}</span>
                        {expense.duplicates.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Duplicate
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(expense.amount.value, expense.amount.currency)}
                    </TableCell>
                    <TableCell>
                      {category && (
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: category.color,
                            color: category.color 
                          }}
                        >
                          {category.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{user.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getConfidenceBadge(expense.confidence)}>
                        {expense.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(expense.status)}>
                        {expense.status}
                      </Badge>
                      {expense.policyFlags.length > 0 && (
                        <Flag className="inline h-3 w-3 ml-1 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {expense.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Flag className="h-4 w-4 mr-2" />
                            Flag as Violation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}