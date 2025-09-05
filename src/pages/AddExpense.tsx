import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Receipt, DollarSign, Save, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const categories = [
  'Meals & Entertainment',
  'Travel',
  'Transportation',
  'Office Supplies',
  'Software & Subscriptions',
  'Training & Education',
  'Marketing',
  'Telecommunications',
  'Other'
];

export default function AddExpense() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date());
  const [reimbursable, setReimbursable] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: user.id,
            merchant: merchant.trim(),
            amount: parseFloat(amount),
            currency,
            category: category || null,
            description: description.trim() || null,
            expense_date: expenseDate ? format(expenseDate, 'yyyy-MM-dd') : null,
            reimbursable,
            receipt_url: receiptUrl.trim() || null,
            status,
            source: 'manual'
          }
        ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      toast({
        title: status === 'draft' ? 'Expense saved as draft' : 'Expense submitted for review',
        description: `Your expense for ${merchant} has been ${status === 'draft' ? 'saved' : 'submitted'}.`,
      });

      navigate('/inbox');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/inbox')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Expense</h1>
          <p className="text-muted-foreground">Create a new expense entry for reimbursement</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="expense-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Expense Details
            </CardTitle>
            <CardDescription>
              Fill in the details of your expense. You can save as draft or submit for approval.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4">
              {/* Merchant */}
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant / Vendor *</Label>
                <Input
                  id="merchant"
                  placeholder="e.g., Starbucks, Amazon, Uber"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  required
                />
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Expense Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expenseDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expenseDate ? format(expenseDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expenseDate}
                      onSelect={setExpenseDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional: Add any additional details about this expense"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Receipt URL */}
              <div className="space-y-2">
                <Label htmlFor="receiptUrl">Receipt URL</Label>
                <Input
                  id="receiptUrl"
                  type="url"
                  placeholder="Optional: Link to receipt image or document"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                />
              </div>

              {/* Reimbursable */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="reimbursable"
                  checked={reimbursable}
                  onCheckedChange={setReimbursable}
                />
                <Label htmlFor="reimbursable">This expense is reimbursable</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={loading || !merchant.trim() || !amount}
                  className="flex-1 gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'pending')}
                  disabled={loading || !merchant.trim() || !amount}
                  className="flex-1 gap-2 enterprise-button"
                >
                  <Send className="h-4 w-4" />
                  Submit for Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}