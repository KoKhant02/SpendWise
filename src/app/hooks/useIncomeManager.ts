/**
 * Custom hook for managing income operations
 * Encapsulates all income-related CRUD logic
 */

import { generateId } from "../utils/idGenerator";
import type { Income, AppState } from "../types";

export interface IncomeManager {
  add: (income: Omit<Income, "id">) => void;
  update: (id: number, income: Omit<Income, "id">) => void;
  remove: (id: number) => void;
  total: number;
}

export function useIncomeManager(
  state: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>
): IncomeManager {
  const handleAdd = (income: Omit<Income, "id">) => {
    const newId = generateId(state.incomes);
    setState(prev => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: newId }]
    }));
  };

  const handleUpdate = (id: number, income: Omit<Income, "id">) => {
    setState(prev => ({
      ...prev,
      incomes: prev.incomes.map(inc => inc.id === id ? { ...income, id } : inc)
    }));
  };

  const handleRemove = (id: number) => {
    setState(prev => ({
      ...prev,
      incomes: prev.incomes.filter(inc => inc.id !== id)
    }));
  };

  const total = state.incomes.reduce((sum, income) => sum + income.amount, 0);

  return {
    add: handleAdd,
    update: handleUpdate,
    remove: handleRemove,
    total
  };
}
