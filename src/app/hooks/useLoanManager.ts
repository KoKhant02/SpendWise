/**
 * Custom hook for managing loan operations
 * Handles all loan-related CRUD and business logic
 */

import { generateId } from "../utils/idGenerator";
import { getTodayDate, getCurrentMonth } from "../utils/calculations";
import { LoanCalculator } from "../services/loanCalculator";
import { formatDate } from "../utils/formatters";
import type { Loan, DailySpending, Income, AppState } from "../types";

export interface LoanManager {
  add: (loanData: {
    friendName: string;
    principal: number;
    interestRate: number;
    interestType: "simple" | "compound";
    expectedReturnDate: string;
    notes?: string;
  }) => void;
  pushMonth: (loanId: number) => void;
  markPaid: (loanId: number, actualAmount?: number) => void;
  writeOff: (loanId: number) => void;
  remove: (loanId: number) => void;
}

export function useLoanManager(
  state: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>
): LoanManager {
  const handleAdd = (loanData: {
    friendName: string;
    principal: number;
    interestRate: number;
    interestType: "simple" | "compound";
    expectedReturnDate: string;
    notes?: string;
  }) => {
    const today = getTodayDate();
    
    // Calculate expected amount with interest using LoanCalculator service
    const expectedAmount = LoanCalculator.calculateLoanExpectedAmount({
      principal: loanData.principal,
      interestRate: loanData.interestRate,
      interestType: loanData.interestType,
      lentDate: today,
      returnDate: loanData.expectedReturnDate
    });
    
    // Create daily expense for lending (this reduces today's budget immediately)
    const expenseId = generateId(state.dailySpending);
    const newExpense: DailySpending = {
      id: expenseId,
      amount: loanData.principal,
      description: `💸 Lent to ${loanData.friendName}`,
      date: today
    };
    
    // Create loan record (income will be created only when "Mark Paid" is clicked)
    const loanId = generateId(state.loans);
    const newLoan: Loan = {
      id: loanId,
      friendName: loanData.friendName,
      principal: loanData.principal,
      interestRate: loanData.interestRate,
      interestType: loanData.interestType,
      lentDate: today,
      expectedReturnDate: loanData.expectedReturnDate,
      expectedAmount,
      status: "pending",
      notes: loanData.notes,
      expenseId,
      incomeId: -1 // No income created yet
    };
    
    setState(prev => ({
      ...prev,
      dailySpending: [...prev.dailySpending, newExpense],
      loans: [...prev.loans, newLoan]
    }));
  };

  const handlePushMonth = (loanId: number) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan || loan.status !== "pending") return;
    
    // Calculate new return date (1 month later) using LoanCalculator
    const newReturnDate = LoanCalculator.pushReturnDate(loan.expectedReturnDate);
    
    // Recalculate expected amount with additional interest
    const newExpectedAmount = LoanCalculator.calculateLoanExpectedAmount({
      principal: loan.principal,
      interestRate: loan.interestRate,
      interestType: loan.interestType,
      lentDate: loan.lentDate,
      returnDate: newReturnDate
    });
    
    // Update the loan
    const updatedLoans = state.loans.map(l =>
      l.id === loanId
        ? { ...l, expectedReturnDate: newReturnDate, expectedAmount: newExpectedAmount }
        : l
    );
    
    setState(prev => ({
      ...prev,
      loans: updatedLoans
    }));
  };

  const handleMarkPaid = (loanId: number, actualAmount?: number) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan || loan.status !== "pending") return;
    
    const paidAmount = actualAmount !== undefined ? actualAmount : loan.expectedAmount;
    
    // Create income entry for the repayment (adds to monthly income)
    const incomeId = generateId(state.incomes);
    const currentDate = new Date();
    const monthYear = formatDate(currentDate.toISOString().split('T')[0], "month-year");
    const newIncome: Income = {
      id: incomeId,
      amount: paidAmount,
      description: `💰 ${loan.friendName} paid back (${monthYear})`
    };
    
    // Mark loan as paid
    const updatedLoans = state.loans.map(l =>
      l.id === loanId
        ? { ...l, status: "paid" as const, expectedAmount: paidAmount, incomeId }
        : l
    );
    
    setState(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome],
      loans: updatedLoans
    }));
  };

  const handleWriteOff = (loanId: number) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan || loan.status !== "pending") return;
    
    // Just mark loan as written off
    // The money is already "spent" in daily spending, so no need to adjust anything
    const updatedLoans = state.loans.map(l =>
      l.id === loanId
        ? { ...l, status: "written-off" as const }
        : l
    );
    
    setState(prev => ({
      ...prev,
      loans: updatedLoans
    }));
  };

  const handleRemove = (loanId: number) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan) return;
    
    // Remove the daily expense
    const updatedDailySpending = state.dailySpending.filter(item => item.id !== loan.expenseId);
    
    // Remove the income if it was created (when marked as paid)
    const updatedIncomes = loan.incomeId > 0 
      ? state.incomes.filter(item => item.id !== loan.incomeId)
      : state.incomes;
    
    // Remove the loan
    const updatedLoans = state.loans.filter(l => l.id !== loanId);
    
    setState(prev => ({
      ...prev,
      dailySpending: updatedDailySpending,
      incomes: updatedIncomes,
      loans: updatedLoans
    }));
  };

  return {
    add: handleAdd,
    pushMonth: handlePushMonth,
    markPaid: handleMarkPaid,
    writeOff: handleWriteOff,
    remove: handleRemove
  };
}
