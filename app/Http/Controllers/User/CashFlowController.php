<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CashFlow;
use Illuminate\Http\Request;

class CashFlowController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        
        $cashFlows = CashFlow::where('created_by', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Calculate summary
        $totalIncome = $cashFlows->where('type', 'income')->sum('amount');
        $totalExpense = $cashFlows->where('type', 'expense')->sum('amount');
        
        // ✅ RETURN OBJECT DENGAN STRUKTUR INI
        return response()->json([
            'data' => $cashFlows,
            'summary' => [
                'total_income' => (float) $totalIncome,
                'total_expense' => (float) $totalExpense,
                'balance' => (float) ($totalIncome - $totalExpense),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'date' => 'required|date',
        ]);

        $validated['created_by'] = $request->user()->id;

        $cashFlow = CashFlow::create($validated);

        return response()->json([
            'message' => 'Cash flow entry created successfully',
            'data' => $cashFlow,
        ], 201);
    }
}
