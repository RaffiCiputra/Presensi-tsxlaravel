import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Download,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cashFlowAPI, CashFlowRecord, mapApiToCashFlow } from "../../lib/api";

interface Transaction {
  id: number;
  date: string;
  type: "in" | "out";
  amount: number;
  description: string;
  category: string;
}

const chartData = [
  { month: "Jan", income: 45000000, expense: 32000000 },
  { month: "Feb", income: 52000000, expense: 38000000 },
  { month: "Mar", income: 48000000, expense: 35000000 },
  { month: "Apr", income: 61000000, expense: 42000000 },
  { month: "May", income: 55000000, expense: 40000000 },
  { month: "Jun", income: 58000000, expense: 43000000 },
];

export function CashFlowPage() {
  // Helper function untuk format Rupiah dengan pemisah ribuan
  const formatRupiah = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID').format(numAmount);
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const [formData, setFormData] = useState({
    type: "in" as "in" | "out",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchCashFlow();
  }, []);

  const fetchCashFlow = async () => {
    setLoading(true);
    try {
      const response = await cashFlowAPI.getAll();
      
      // Map API data to transactions
      const mappedTransactions: Transaction[] = response.data.data.map((cf) => ({
        id: cf.id,
        date: cf.date,
        type: cf.type === 'income' ? 'in' : 'out',
        amount: parseFloat(cf.amount),
        description: cf.description,
        category: extractCategory(cf.description),
      }));

      setTransactions(mappedTransactions);
      
      // Set summary
      setTotalIncome(response.data.summary.total_income);
      setTotalExpense(response.data.summary.total_expense);
      setCurrentBalance(response.data.summary.balance);
    } catch (error: any) {
      console.error('Failed to fetch cash flow:', error);
      setError('Failed to load cash flow data');
    } finally {
      setLoading(false);
    }
  };

  const extractCategory = (description: string): string => {
    // Simple category extraction from description
    const categories: { [key: string]: string[] } = {
      'Salary': ['salary', 'payment', 'wage'],
      'Supplies': ['supplies', 'equipment', 'materials'],
      'Utilities': ['utilities', 'bill', 'electricity', 'water'],
      'Revenue': ['revenue', 'income', 'sales'],
      'Bonus': ['bonus', 'incentive'],
    };

    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(formData.amount);

    if (formData.type === "out" && amount > currentBalance) {
      setError("Insufficient balance! Transaction would result in negative balance.");
      return;
    }

    setError("Only users can create transactions. This is view-only for admin.");
  };

  const exportToCSV = async () => {
    try {
      const response = await cashFlowAPI.export();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cash-flow-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export cash flow');
    }
  };

  return (
    <div className="cashflow-page-container">
      {/* Header */}
      <div className="cashflow-header">
        <div className="cashflow-header-content">
          <h1 className="cashflow-title">Cash Flow Management</h1>
          <p className="cashflow-description">
            Track your income and expenses
          </p>
        </div>

        <div className="cashflow-header-actions">
          <Button variant="outline" onClick={exportToCSV} className="cashflow-export-btn">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="cashflow-stats-grid">
        <Card className="cashflow-stat-card cashflow-income-card">
          <CardContent className="cashflow-stat-content">
            <div className="cashflow-stat-header">
              <div className="cashflow-stat-icon cashflow-income-icon">
                <TrendingUp className="h-6 w-6" />
              </div>
              <Badge className="cashflow-income-badge">+12%</Badge>
            </div>
            <p className="cashflow-stat-label">Total Cash In</p>
            <p className="cashflow-stat-value cashflow-income-value">
              Rp{formatRupiah(totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="cashflow-stat-card cashflow-expense-card">
          <CardContent className="cashflow-stat-content">
            <div className="cashflow-stat-header">
              <div className="cashflow-stat-icon cashflow-expense-icon">
                <TrendingDown className="h-6 w-6" />
              </div>
              <Badge className="cashflow-expense-badge">+8%</Badge>
            </div>
            <p className="cashflow-stat-label">Total Cash Out</p>
            <p className="cashflow-stat-value cashflow-expense-value">
              Rp{formatRupiah(totalExpense)}
            </p>
          </CardContent>
        </Card>

        <Card className="cashflow-stat-card cashflow-balance-card">
          <CardContent className="cashflow-stat-content">
            <div className="cashflow-stat-header">
              <div className="cashflow-stat-icon cashflow-balance-icon">
                <Wallet className="h-6 w-6" />
              </div>
              <Badge className="cashflow-balance-badge">Balance</Badge>
            </div>
            <p className="cashflow-stat-label">Current Balance</p>
            <p className="cashflow-stat-value cashflow-balance-value">
              Rp{formatRupiah(currentBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="cashflow-chart-card">
        <CardHeader>
          <CardTitle className="cashflow-chart-title">Cash Flow Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="cashflow-chart-grid" />
              <XAxis dataKey="month" className="cashflow-chart-axis" />
              <YAxis className="cashflow-chart-axis" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => `Rp${formatRupiah(value)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="cashflow-table-card">
        <CardHeader>
          <CardTitle className="cashflow-table-title">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="cashflow-table-wrapper">
              <Table>
                <TableHeader className="cashflow-table-header">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="cashflow-table-row">
                      <TableCell className="cashflow-table-date">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.type === "in"
                              ? "cashflow-badge-income"
                              : "cashflow-badge-expense"
                          }
                        >
                          {transaction.type === "in" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {transaction.type === "in" ? "Cash In" : "Cash Out"}
                        </Badge>
                      </TableCell>
                      <TableCell className="cashflow-table-category">{transaction.category}</TableCell>
                      <TableCell className="cashflow-table-description">
                        {transaction.description}
                      </TableCell>
                      <TableCell
                        className={`cashflow-table-amount ${
                          transaction.type === "in"
                            ? "cashflow-amount-income"
                            : "cashflow-amount-expense"
                        }`}
                      >
                        {transaction.type === "in" ? "+" : "-"}
                        Rp{formatRupiah(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
