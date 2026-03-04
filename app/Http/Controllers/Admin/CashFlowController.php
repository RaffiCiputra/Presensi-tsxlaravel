<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashFlow;
use Illuminate\Http\Request;

class CashFlowController extends Controller
{
    public function index()
    {
        $cashFlows = CashFlow::with('creator:id,name,email')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalIncome = $cashFlows->where('type', 'income')->sum('amount');
        $totalExpense = $cashFlows->where('type', 'expense')->sum('amount');

        return response()->json([
            'data' => $cashFlows,
            'summary' => [
                'total_income' => (float) $totalIncome,
                'total_expense' => (float) $totalExpense,
                'balance' => (float) ($totalIncome - $totalExpense),
            ],
        ]);
    }

    public function export()
    {
        $cashFlows = CashFlow::with('creator:id,name')
            ->orderBy('date', 'desc')
            ->get();

        $filename = 'cashflow-' . now()->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($cashFlows) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Date', 'Type', 'Amount', 'Description', 'Creator']);

            foreach ($cashFlows as $cf) {
                fputcsv($file, [
                    $cf->date->format('Y-m-d'),
                    ucfirst($cf->type),
                    $cf->amount,
                    $cf->description,
                    $cf->creator->name ?? 'Unknown',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0',
            'type'        => 'required|in:income,expense',
            'date'        => 'required|date',
            'created_by'  => 'required|exists:users,id',
        ]);

        $cashFlow = CashFlow::create($validated);

        return response()->json([
            'message' => 'Cash flow entry created successfully',
            'data'    => $cashFlow,
        ], 201);
    }
}
