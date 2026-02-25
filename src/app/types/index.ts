/**
 * Shared TypeScript interfaces for SpendWise application
 * SINGLE SOURCE OF TRUTH for all type definitions
 */

export interface Settings {
  savingsGoal: number;
  savingsGoalType: "daily" | "monthly" | "yearly";
  currency: string;
}

export interface Income {
  id: number;
  amount: number;
  description: string;
}

export interface FixedExpense {
  id: number;
  name: string;
  amount: number;
  frequency: "monthly" | "yearly";
}

export interface OneTimePlanned {
  id: number;
  name: string;
  amount: number;
  month: string;
}

export interface DailySpending {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export interface Loan {
  id: number;
  friendName: string;
  principal: number;
  interestRate: number;
  interestType: "simple" | "compound";
  lentDate: string;
  expectedReturnDate: string;
  expectedAmount: number;
  status: "pending" | "paid" | "written-off";
  notes?: string;
  expenseId: number;
  incomeId: number;
}

export interface AppState {
  settings: Settings;
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  oneTimePlanned: OneTimePlanned[];
  dailySpending: DailySpending[];
  loans: Loan[];
}
