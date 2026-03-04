import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import { cashFlowAPI } from "../../lib/api";

interface Transaction {
  id: number;
  date: string;
  type: "in" | "out";
  amount: number;
  description: string;
  category: string;
}

interface ApiCashFlow {
  id: number;
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  created_by: number;
  created_at: string;
}

interface ApiCashFlowSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export function CashFlowPage() {
  const formatRupiah = (amount: number | string): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("id-ID").format(numAmount);
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
      const apiData = response.data as { data: ApiCashFlow[]; summary: ApiCashFlowSummary };

      const mappedTransactions: Transaction[] = apiData.data.map((cf) => ({
        id: cf.id,
        date: cf.date,
        type: cf.type === "income" ? "in" : "out",
        amount: parseFloat(cf.amount),
        description: cf.description,
        category: extractCategory(cf.description),
      }));

      setTransactions(mappedTransactions);

      setTotalIncome(apiData.summary.total_income);
      setTotalExpense(apiData.summary.total_expense);
      setCurrentBalance(apiData.summary.balance);
    } catch (error: any) {
      console.error("Failed to fetch cash flow:", error);
      setError("Failed to load cash flow data");
    } finally {
      setLoading(false);
    }
  };

  const extractCategory = (description: string): string => {
    const categories: { [key: string]: string[] } = {
      Salary: ["salary", "payment", "wage", "gaji"],
      Supplies: ["supplies", "equipment", "materials", "atk"],
      Utilities: ["utilities", "bill", "electricity", "water", "listrik", "air"],
      Revenue: ["revenue", "income", "sales"],
      Bonus: ["bonus", "incentive"],
    };

    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    return "Other";
  };

  // ====== AGREGASI DATA UNTUK CHART ======
  const chartData = useMemo(() => {
    // key: "YYYY-MM", value: { income, expense }
    const map: Record<string, { monthLabel: string; income: number; expense: number }> = {};

    transactions.forEach((t) => {
      if (!t.date) return;
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      const monthIdx = d.getMonth(); // 0-11
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const key = `${year}-${monthIdx + 1}`.padStart(7, "0"); // misal "2026-03"
      const monthLabel = `${monthNames[monthIdx]} ${String(year).slice(-2)}`;

      if (!map[key]) {
        map[key] = { monthLabel, income: 0, expense: 0 };
      }

      if (t.type === "in") {
        map[key].income += t.amount;
      } else {
        map[key].expense += t.amount;
      }
    });

    // sort by key (waktu)
    const sortedKeys = Object.keys(map).sort();
    return sortedKeys.map((k) => ({
      month: map[k].monthLabel,
      income: map[k].income,
      expense: map[k].expense,
    }));
  }, [transactions]);

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
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cash-flow-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      setError("Failed to export cash flow");
    }
  };

  return (
    <div className="cashflow-page-container">
      {/* Header */}
      <div className="cashflow-header">
        <div className="cashflow-header-content">
          <h1 className="cashflow-title">Cash Flow Management</h1>
          <p className="cashflow-description">Track your income and expenses</p>
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
              <Badge className="cashflow-income-badge">Cash In</Badge>
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
              <Badge className="cashflow-expense-badge">Cash Out</Badge>
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
          {chartData.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Belum ada data yang cukup untuk menampilkan grafik.
            </div>
          ) : (
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
          )}
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
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No transactions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
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
                        <TableCell className="cashflow-table-category">
                          {transaction.category}
                        </TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
