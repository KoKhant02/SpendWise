/**
 * FinancialBlueprint Component - Refactored
 * Now uses modular tab components for better maintainability
 * Reduced from 1000+ lines to ~100 lines
 */

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { DailySpending, FixedExpense, Income, Loan, OneTimePlanned, Settings } from "../types";
import { TabNavigation } from "./molecules/TabNavigation";
import { DailySpendingTab } from "./tabs/DailySpendingTab";
import { FixedExpensesTab } from "./tabs/FixedExpensesTab";
import { IncomeTab } from "./tabs/IncomeTab";
import { LoansTab } from "./tabs/LoansTab";
import { OneTimePlannedTab } from "./tabs/OneTimePlannedTab";
import { Card } from "./ui/card";

interface FinancialBlueprintProps {
  settings: Settings;
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  oneTimePlanned: OneTimePlanned[];
  dailySpending: DailySpending[];
  loans: Loan[];
  currentMonth: string;
  onUpdateSettings: (settings: Settings) => void;
  onAddIncome: (income: Omit<Income, "id">) => void;
  onUpdateIncome: (id: number, income: Omit<Income, "id">) => void;
  onDeleteIncome: (id: number) => void;
  onAddFixedExpense: (expense: Omit<FixedExpense, "id">) => void;
  onUpdateFixedExpense: (id: number, expense: Omit<FixedExpense, "id">) => void;
  onDeleteFixedExpense: (id: number) => void;
  onAddOneTime: (expense: Omit<OneTimePlanned, "id">) => void;
  onUpdateOneTime: (id: number, expense: Omit<OneTimePlanned, "id">) => void;
  onDeleteOneTime: (id: number) => void;
  onUpdateExpense: (id: number, expense: Omit<DailySpending, "id">) => void;
  onDeleteExpense: (id: number) => void;
  onAddLoan: (loanData: {
    friendName: string;
    principal: number;
    interestRate: number;
    interestType: "simple" | "compound";
    expectedReturnDate: string;
    notes?: string;
  }) => void;
  onPushLoanMonth: (loanId: number) => void;
  onMarkLoanPaid: (loanId: number, actualAmount?: number) => void;
  onWriteOffLoan: (loanId: number) => void;
  onDeleteLoan: (loanId: number) => void;
}

export function FinancialBlueprint({
  settings,
  incomes,
  fixedExpenses,
  oneTimePlanned,
  dailySpending,
  loans,
  currentMonth,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome,
  onAddFixedExpense,
  onUpdateFixedExpense,
  onDeleteFixedExpense,
  onAddOneTime,
  onUpdateOneTime,
  onDeleteOneTime,
  onUpdateExpense,
  onDeleteExpense,
  onAddLoan,
  onPushLoanMonth,
  onMarkLoanPaid,
  onWriteOffLoan,
  onDeleteLoan
}: FinancialBlueprintProps) {
  const [activeTab, setActiveTab] = useState("spending");

  return (
    <Card className="p-6">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "spending" && (
            <motion.div
              key="spending"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <DailySpendingTab
                spending={dailySpending}
                currentMonth={currentMonth}
                currency={settings.currency}
                onUpdate={onUpdateExpense}
                onDelete={onDeleteExpense}
              />
            </motion.div>
          )}

          {activeTab === "loans" && (
            <motion.div
              key="loans"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <LoansTab
                loans={loans}
                currency={settings.currency}
                currentMonth={currentMonth}
                onAdd={onAddLoan}
                onPushMonth={onPushLoanMonth}
                onMarkPaid={onMarkLoanPaid}
                onWriteOff={onWriteOffLoan}
                onDelete={onDeleteLoan}
              />
            </motion.div>
          )}

          {activeTab === "planned" && (
            <motion.div
              key="planned"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <OneTimePlannedTab
                expenses={oneTimePlanned}
                currentMonth={currentMonth}
                currency={settings.currency}
                onAdd={onAddOneTime}
                onUpdate={onUpdateOneTime}
                onDelete={onDeleteOneTime}
              />
            </motion.div>
          )}

          {activeTab === "fixed" && (
            <motion.div
              key="fixed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FixedExpensesTab
                expenses={fixedExpenses}
                currency={settings.currency}
                onAdd={onAddFixedExpense}
                onUpdate={onUpdateFixedExpense}
                onDelete={onDeleteFixedExpense}
              />
            </motion.div>
          )}

          {activeTab === "income" && (
            <motion.div
              key="income"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <IncomeTab
                incomes={incomes}
                currency={settings.currency}
                onAdd={onAddIncome}
                onUpdate={onUpdateIncome}
                onDelete={onDeleteIncome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}