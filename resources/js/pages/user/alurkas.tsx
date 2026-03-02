import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { cashFlowAPI, ApiCashFlow } from "../../lib/api";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface Transaction {
  id: number;
  type: "Income" | "Expense";
  amount: number;
  description: string;
  category: string;
  date: string;
}

export function CashFlowPage() {
  // Helper function untuk format Rupiah dengan pemisah ribuan
  const formatRupiah = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID').format(numAmount);
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    type: "Income" as "Income" | "Expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchCashFlow();
  }, []);

  const fetchCashFlow = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching cash flow...'); // Debug
      const response = await cashFlowAPI.getUserCashFlow();
      
      console.log('✅ Full Response:', response); // Debug
      console.log('✅ Response Data:', response.data); // Debug
      
      // Handle jika backend return array langsung (bukan wrapped dalam {data: ...})
      const dataArray = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      
      console.log('✅ Data Array:', dataArray); // Debug
      
      // Map API data to transactions
      const mappedTransactions: Transaction[] = dataArray.map((cf: ApiCashFlow) => ({
        id: cf.id,
        type: cf.type === 'income' ? 'Income' : 'Expense',
        amount: parseFloat(cf.amount),
        description: cf.description,
        category: extractCategory(cf.description),
        date: cf.date,
      }));

      console.log(`✅ Mapped ${mappedTransactions.length} transactions`); // Debug
      setTransactions(mappedTransactions);
      setError(''); // Clear any previous errors
    } catch (error: any) {
      console.error('❌ Failed to fetch cash flow:', error);
      console.error('Error response:', error.response); // Debug
      setError(error.response?.data?.message || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const extractCategory = (description: string): string => {
    const categories: { [key: string]: string[] } = {
      'Revenue': ['project', 'payment', 'consulting', 'service'],
      'Supplies': ['supplies', 'equipment', 'materials', 'office'],
      'Utilities': ['utilities', 'bill'],
    };

    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  };

  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const cashFlowData = {
        description: `${formData.category}: ${formData.description}`,
        amount: parseFloat(formData.amount),
        type: formData.type === 'Income' ? 'income' as const : 'expense' as const,
        date: formData.date,
      };

      console.log('📤 Submitting:', cashFlowData); // Debug

      await cashFlowAPI.create(cashFlowData);
      
      setSuccess("Transaction added successfully!");
      setIsFormOpen(false);
      
      // Refresh data - akan menampilkan transaksi baru di tabel
      await fetchCashFlow();
      
      // Reset form
      setFormData({
        type: "Income",
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
      });
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error('❌ Add transaction error:', error);
      setError(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cashflow-simple-container">
      {/* Header */}
      <div className="cashflow-simple-header">
        <div className="cashflow-simple-header-content">
          <h1 className="cashflow-simple-title">Cash Flow Management</h1>
          <p className="cashflow-simple-subtitle">Track your income and expenses</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(true);
            setEditingId(null);
            setFormData({
              type: "Income",
              amount: "",
              description: "",
              category: "",
              date: new Date().toISOString().split('T')[0],
            });
          }}
          className="cashflow-simple-add-btn"
        >
          <Plus className="h-5 w-5" />
          Add Transaction
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 dark:bg-green-950 border-green-200">
          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="cashflow-simple-stats">
        <div className="cashflow-simple-stat-card cashflow-simple-income-card">
          <div className="cashflow-simple-stat-icon">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="cashflow-simple-stat-info">
            <p className="cashflow-simple-stat-label">Total Income</p>
            <p className="cashflow-simple-stat-value">Rp{formatRupiah(totalIncome)}</p>
          </div>
        </div>

        <div className="cashflow-simple-stat-card cashflow-simple-expense-card">
          <div className="cashflow-simple-stat-icon">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div className="cashflow-simple-stat-info">
            <p className="cashflow-simple-stat-label">Total Expense</p>
            <p className="cashflow-simple-stat-value">Rp{formatRupiah(totalExpense)}</p>
          </div>
        </div>

        <div className="cashflow-simple-stat-card cashflow-simple-balance-card">
          <div className="cashflow-simple-stat-icon">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="cashflow-simple-stat-info">
            <p className="cashflow-simple-stat-label">Balance</p>
            <p className="cashflow-simple-stat-value">Rp{formatRupiah(balance)}</p>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="cashflow-simple-modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="cashflow-simple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cashflow-simple-modal-header">
              <h2 className="cashflow-simple-modal-title">
                {editingId ? "Edit Transaction" : "Add New Transaction"}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="cashflow-simple-modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cashflow-simple-form">
              <div className="cashflow-simple-form-group">
                <label className="cashflow-simple-label">Type</label>
                <div className="cashflow-simple-type-selector">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "Income" })}
                    className={`cashflow-simple-type-btn ${
                      formData.type === "Income" ? "active income" : ""
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "Expense" })}
                    className={`cashflow-simple-type-btn ${
                      formData.type === "Expense" ? "active expense" : ""
                    }`}
                  >
                    <TrendingDown className="h-4 w-4" />
                    Expense
                  </button>
                </div>
              </div>

              <div className="cashflow-simple-form-grid">
                <div className="cashflow-simple-form-group">
                  <label className="cashflow-simple-label">Amount</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    required
                    className="cashflow-simple-input"
                  />
                </div>

                <div className="cashflow-simple-form-group">
                  <label className="cashflow-simple-label">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="cashflow-simple-input"
                  />
                </div>
              </div>

              <div className="cashflow-simple-form-group">
                <label className="cashflow-simple-label">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Salary, Supplies, Utilities"
                  required
                  className="cashflow-simple-input"
                />
              </div>

              <div className="cashflow-simple-form-group">
                <label className="cashflow-simple-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter transaction details..."
                  required
                  rows={3}
                  className="cashflow-simple-textarea"
                />
              </div>

              <div className="cashflow-simple-form-actions">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="cashflow-simple-cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="cashflow-simple-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions yet. Click "Add Transaction" to get started.
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
                              transaction.type === "Income"
                                ? "cashflow-badge-income"
                                : "cashflow-badge-expense"
                            }
                          >
                            {transaction.type === "Income" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {transaction.type === "Income" ? "Cash In" : "Cash Out"}
                          </Badge>
                        </TableCell>
                        <TableCell className="cashflow-table-category">{transaction.category}</TableCell>
                        <TableCell className="cashflow-table-description">
                          {transaction.description}
                        </TableCell>
                        <TableCell
                          className={`cashflow-table-amount ${
                            transaction.type === "Income"
                              ? "cashflow-amount-income"
                              : "cashflow-amount-expense"
                          }`}
                        >
                          {transaction.type === "Income" ? "+" : "-"}
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
