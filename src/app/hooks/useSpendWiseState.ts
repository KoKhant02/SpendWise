/**
 * Master state management hook for SpendWise
 * Combines localStorage persistence with state migrations
 */

import { useLocalStorage } from "./useLocalStorage";
import type { AppState, Settings } from "../types";

const INITIAL_STATE: AppState = {
  settings: {
    savingsGoal: 5000,
    savingsGoalType: "monthly",
    currency: "THB"
  },
  incomes: [
    { id: 1, amount: 30000, description: "Website Developer at DAT company" },
    { id: 2, amount: 2000, description: "Business PanelX" }
  ],
  fixedExpenses: [
    { id: 1, name: "Rent", amount: 2000, frequency: "monthly" },
    { id: 2, name: "Internet", amount: 2500, frequency: "yearly" }
  ],
  oneTimePlanned: [
    { id: 101, name: "Monitor", amount: 7000, month: "2026-03" },
    { id: 102, name: "Debt Repayment", amount: 2000, month: "2026-02" }
  ],
  dailySpending: [],
  loans: []
};

/**
 * Migrates old state structures to current format
 */
function migrateState(state: any): AppState {
  // Migration: Handle old state structure that had monthlyIncome instead of incomes array
  if (!state.incomes && state.settings?.monthlyIncome) {
    state.incomes = [
      { id: 1, amount: state.settings.monthlyIncome, description: "Primary Income" }
    ];
    delete state.settings.monthlyIncome;
  }
  
  // Ensure incomes array exists
  if (!state.incomes) {
    state.incomes = [];
  }
  
  // Ensure settings exists
  if (!state.settings) {
    state.settings = { savingsGoal: 5000, savingsGoalType: "monthly", currency: "THB" };
  }
  
  // Migration: Add savingsGoalType if missing
  if (!state.settings.savingsGoalType) {
    state.settings.savingsGoalType = "monthly";
  }
  
  // Ensure loans array exists
  if (!state.loans) {
    state.loans = [];
  }
  
  return state;
}

export interface SpendWiseState {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateSettings: (settings: Settings) => void;
}

export function useSpendWiseState(): SpendWiseState {
  const [rawState, setRawState] = useLocalStorage<AppState>('spendwise-state', INITIAL_STATE);
  
  // Apply migrations to loaded state
  const state = migrateState(rawState);

  const updateSettings = (newSettings: Settings) => {
    setRawState(prev => ({ ...prev, settings: newSettings }));
  };

  return {
    state,
    setState: setRawState,
    updateSettings
  };
}
