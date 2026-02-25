/**
 * Custom hook for managing expense operations
 * Handles Fixed Expenses, One-Time Planned Expenses, and Daily Spending
 */

import { generateId } from "../utils/idGenerator";
import { getTodayDate } from "../utils/calculations";
import type { FixedExpense, OneTimePlanned, DailySpending, AppState } from "../types";

export interface ExpenseManager {
  // Fixed Expenses
  addFixed: (expense: Omit<FixedExpense, "id">) => void;
  updateFixed: (id: number, expense: Omit<FixedExpense, "id">) => void;
  removeFixed: (id: number) => void;
  
  // One-Time Planned Expenses
  addOneTime: (expense: Omit<OneTimePlanned, "id">) => void;
  updateOneTime: (id: number, expense: Omit<OneTimePlanned, "id">) => void;
  removeOneTime: (id: number) => void;
  
  // Daily Spending
  addDaily: (amount: number, description: string) => void;
  updateDaily: (id: number, expense: Omit<DailySpending, "id">) => void;
  removeDaily: (id: number) => void;
}

export function useExpenseManager(
  state: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>
): ExpenseManager {
  // Fixed Expenses
  const handleAddFixed = (expense: Omit<FixedExpense, "id">) => {
    const newId = generateId(state.fixedExpenses);
    setState(prev => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, { ...expense, id: newId }]
    }));
  };

  const handleUpdateFixed = (id: number, expense: Omit<FixedExpense, "id">) => {
    setState(prev => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.map(exp => exp.id === id ? { ...expense, id } : exp)
    }));
  };

  const handleRemoveFixed = (id: number) => {
    setState(prev => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter(e => e.id !== id)
    }));
  };

  // One-Time Planned Expenses
  const handleAddOneTime = (expense: Omit<OneTimePlanned, "id">) => {
    const newId = generateId(state.oneTimePlanned);
    setState(prev => ({
      ...prev,
      oneTimePlanned: [...prev.oneTimePlanned, { ...expense, id: newId }]
    }));
  };

  const handleUpdateOneTime = (id: number, expense: Omit<OneTimePlanned, "id">) => {
    setState(prev => ({
      ...prev,
      oneTimePlanned: prev.oneTimePlanned.map(exp => exp.id === id ? { ...expense, id } : exp)
    }));
  };

  const handleRemoveOneTime = (id: number) => {
    setState(prev => ({
      ...prev,
      oneTimePlanned: prev.oneTimePlanned.filter(e => e.id !== id)
    }));
  };

  // Daily Spending
  const handleAddDaily = (amount: number, description: string) => {
    const newId = generateId(state.dailySpending);
    const today = getTodayDate();
    setState(prev => ({
      ...prev,
      dailySpending: [
        ...prev.dailySpending,
        { id: newId, amount, description, date: today }
      ]
    }));
  };

  const handleUpdateDaily = (id: number, expense: Omit<DailySpending, "id">) => {
    setState(prev => ({
      ...prev,
      dailySpending: prev.dailySpending.map(exp => exp.id === id ? { ...expense, id } : exp)
    }));
  };

  const handleRemoveDaily = (id: number) => {
    setState(prev => ({
      ...prev,
      dailySpending: prev.dailySpending.filter(e => e.id !== id)
    }));
  };

  return {
    addFixed: handleAddFixed,
    updateFixed: handleUpdateFixed,
    removeFixed: handleRemoveFixed,
    addOneTime: handleAddOneTime,
    updateOneTime: handleUpdateOneTime,
    removeOneTime: handleRemoveOneTime,
    addDaily: handleAddDaily,
    updateDaily: handleUpdateDaily,
    removeDaily: handleRemoveDaily
  };
}
