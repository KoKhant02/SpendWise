/**
 * Custom hook for all financial calculations
 * Centralizes calculation logic with memoization
 */

import { useMemo } from "react";
import {
  calculateMonthlyCommitment,
  calculateDailyUsableAmount,
  calculateSpentThisMonth,
  calculateSpentToday,
  getCurrentMonth,
  getTodayDate,
  getDaysRemainingInMonth,
} from "../utils/calculations";
import type { AppState } from "../types";

export interface CalculationResults {
  // Date/Time values
  currentMonth: string;
  today: string;
  daysRemaining: number;
  
  // Financial calculations
  monthlyIncome: number;
  commitment: number;
  spentThisMonth: number;
  spentToday: number;
  baseDailyUsableAmount: number;
  availableBudget: number;
  
  // Risk assessment
  isAtRisk: boolean;
}

export function useCalculations(state: AppState): CalculationResults {
  const currentMonth = getCurrentMonth();
  const today = getTodayDate();
  const daysRemaining = getDaysRemainingInMonth();

  // Calculate total monthly income
  const monthlyIncome = useMemo(
    () => state.incomes.reduce((sum, income) => sum + income.amount, 0),
    [state.incomes]
  );

  // Calculate total monthly commitment
  const commitment = useMemo(
    () => calculateMonthlyCommitment(
      state.settings.savingsGoal,
      state.fixedExpenses,
      state.oneTimePlanned,
      currentMonth,
      state.settings.savingsGoalType
    ),
    [state.settings.savingsGoal, state.settings.savingsGoalType, state.fixedExpenses, state.oneTimePlanned, currentMonth]
  );

  // Calculate spent amounts
  const spentThisMonth = useMemo(
    () => calculateSpentThisMonth(state.dailySpending, currentMonth),
    [state.dailySpending, currentMonth]
  );

  const spentToday = useMemo(
    () => calculateSpentToday(state.dailySpending, today),
    [state.dailySpending, today]
  );

  // Calculate the base daily usable amount
  const baseDailyUsableAmount = useMemo(
    () => calculateDailyUsableAmount(
      monthlyIncome,
      commitment,
      spentThisMonth - spentToday, // Exclude today's spending to get budget at START of today
      daysRemaining
    ),
    [monthlyIncome, commitment, spentThisMonth, spentToday, daysRemaining]
  );

  // Calculate available budget (what's left for the month)
  const availableBudget = monthlyIncome - commitment - spentThisMonth;

  // Risk assessment
  const isAtRisk = baseDailyUsableAmount <= 0;

  return {
    currentMonth,
    today,
    daysRemaining,
    monthlyIncome,
    commitment,
    spentThisMonth,
    spentToday,
    baseDailyUsableAmount,
    availableBudget,
    isAtRisk
  };
}
