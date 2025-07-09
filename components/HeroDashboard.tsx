import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from './ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  Props,
  Transaction,
  FirestoreTimestamp,
  TransactionType,
  FormData,
  ChartDataPoint,
} from '@/types/transaction';
import { getAuth } from 'firebase/auth';

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Rent',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Salary',
  'Freelance',
  'Investment',
] as const;
const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#ff00ff',
  '#00ffff',
  '#ffff00',
] as const;

type Category = (typeof categories)[number];

interface CategoryDataPoint {
  name: Category;
  value: number;
}

function parseFirestoreDate(date: FirestoreTimestamp): Date {
  if (date && typeof date === 'object' && '_seconds' in date) {
    return new Date(date._seconds * 1000);
  }
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date);
  }
  return new Date();
}

const HeroDashboard: React.FC<Props> = ({ showAddTransaction, setShowAddTransaction }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | TransactionType>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const fetchTransactions = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      const token = await user.getIdToken();
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch transactions: ${res.status} ${res.statusText}`);
      }
      const data: Transaction[] = await res.json();
      const parsed: Transaction[] = data.map(
        (tx): Transaction => ({
          ...tx,
          date: parseFirestoreDate(tx.date),
        })
      );
      setTransactions(parsed);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      console.error('Error fetching transactions:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      const token = await user.getIdToken();

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add transaction: ${response.status} ${response.statusText}`);
      }

      const newTx: Transaction = {
        id: 'temp-' + Date.now(),
        ...transactionData,
        amount:
          transactionData.type === 'expense'
            ? -Math.abs(transactionData.amount)
            : Math.abs(transactionData.amount),
        date: new Date(transactionData.date),
      };

      setTransactions((prev) => [newTx, ...prev]);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowAddTransaction(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add transaction';
      console.error('Error adding transaction:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((t): t is Transaction => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter((t): t is Transaction => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const chartData: ChartDataPoint[] = transactions
    .slice(0, 7)
    .reverse()
    .map(
      (t): ChartDataPoint => ({
        date: t.date.toLocaleDateString(),
        amount: Math.abs(t.amount),
        type: t.type,
      })
    );

  const categoryData: CategoryDataPoint[] = categories
    .map((cat): CategoryDataPoint => {
      const amount = transactions
        .filter((t): t is Transaction => t.category === cat && t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { name: cat, value: amount };
    })
    .filter((item): item is CategoryDataPoint => item.value > 0);

  const handleSubmit = (): void => {
    if (!formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    addTransaction({
      ...formData,
      amount,
      date: new Date(formData.date),
    });
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleTypeChange = (value: string): void => {
    if (value === 'income' || value === 'expense') {
      setFormData((prev) => ({ ...prev, type: value as TransactionType }));
    }
  };

  const handleFilterChange = (value: string): void => {
    if (value === 'all' || value === 'income' || value === 'expense') {
      setSelectedFilter(value as 'all' | TransactionType);
    }
  };

  const filteredTransactions =
    selectedFilter === 'all'
      ? transactions
      : transactions.filter((t): t is Transaction => t.type === selectedFilter);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen text-white p-6">
      <div className="mx-auto space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[oklch(0.145 0 0)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                ${balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[oklch(0.145 0 0)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[oklch(0.145 0 0)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                ${totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {showAddTransaction && (
          <Card className="bg-[oklch(0.145 0 0)] animate-in slide-in-from-top duration-300">
            <CardHeader>
              <CardTitle>Add New Transaction</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your transaction details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="bg-[oklch(0.145 0 0)]"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={handleTypeChange}>
                      <SelectTrigger className="bg-[oklch(0.145 0 0)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="bg-[oklch(0.145 0 0)]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="bg-[oklch(0.145 0 0)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-black"
                    placeholder="Add a note about this transaction..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddTransaction(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[oklch(0.145 0 0)]">
            <CardHeader>
              <CardTitle>Transaction Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[oklch(0.145 0 0)]">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry: Record<string, unknown>) => {
                      const name = entry.name as string;
                      const percent = entry.percent as number;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-[oklch(0.145 0 0)]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <Select value={selectedFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-32 bg-[oklch(0.145 0 0)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading && transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Loading transactions...</div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No transactions found</div>
              ) : (
                filteredTransactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-black rounded-lg hover:border-neutral-900 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-sm text-gray-400">
                          {transaction.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}$
                        {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroDashboard;
