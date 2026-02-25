/**
 * OneTimePlannedTab Component
 * Manages one-time planned expenses by month
 */

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FormField } from "../atoms/FormField";
import { ActionButtons } from "../molecules/ActionButtons";
import { SectionHeader } from "../molecules/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { CurrencyDisplay } from "../atoms/CurrencyDisplay";
import { Badge } from "../atoms/Badge";
import { formatDate } from "../../utils/formatters";
import type { OneTimePlanned } from "../../types";

interface OneTimePlannedTabProps {
  expenses: OneTimePlanned[];
  currentMonth: string;
  currency: string;
  onAdd: (expense: Omit<OneTimePlanned, "id">) => void;
  onUpdate: (id: number, expense: Omit<OneTimePlanned, "id">) => void;
  onDelete: (id: number) => void;
}

export function OneTimePlannedTab({
  expenses,
  currentMonth,
  currency,
  onAdd,
  onUpdate,
  onDelete
}: OneTimePlannedTabProps) {
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    month: currentMonth
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    amount: "",
    month: ""
  });

  const handleAdd = () => {
    if (newExpense.name && newExpense.amount && newExpense.month) {
      onAdd({
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        month: newExpense.month
      });
      setNewExpense({ name: "", amount: "", month: currentMonth });
    }
  };

  const startEdit = (expense: OneTimePlanned) => {
    setEditingId(expense.id);
    setEditData({
      name: expense.name,
      amount: expense.amount.toString(),
      month: expense.month
    });
  };

  const saveEdit = () => {
    if (editingId && editData.name && editData.amount && editData.month) {
      onUpdate(editingId, {
        name: editData.name,
        amount: parseFloat(editData.amount),
        month: editData.month
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", amount: "", month: "" });
  };

  // Calculate this month's planned expenses
  const thisMonthExpenses = expenses.filter((e) => e.month === currentMonth);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by month
  const groupedByMonth = expenses.reduce((acc, expense) => {
    if (!acc[expense.month]) {
      acc[expense.month] = [];
    }
    acc[expense.month].push(expense);
    return acc;
  }, {} as Record<string, OneTimePlanned[]>);

  const sortedMonths = Object.keys(groupedByMonth).sort();

  return (
    <div className="space-y-6">
      {/* This Month Total */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/80 dark:to-pink-950/80 border-purple-200 dark:border-purple-800/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-gray-700 dark:text-purple-300">Planned This Month</span>
            </div>
            <CurrencyDisplay
              amount={thisMonthTotal}
              currency={currency}
              size="xl"
              color="text-purple-600 dark:text-purple-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New Planned Expense */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
            title="Add Planned Expense"
          />
          <div className="space-y-4">
            <FormField
              id="planned-name"
              label="Expense Name"
              value={newExpense.name}
              onChange={(val) => setNewExpense({ ...newExpense, name: val })}
              placeholder="e.g., New Monitor, Vacation, Debt Payment"
            />
            <FormField
              id="planned-amount"
              label={`Amount (${currency})`}
              type="number"
              value={newExpense.amount}
              onChange={(val) => setNewExpense({ ...newExpense, amount: val })}
              placeholder="0.00"
              min={0}
              step="0.01"
            />
            <FormField
              id="planned-month"
              label="Planned Month"
              type="month"
              value={newExpense.month}
              onChange={(val) => setNewExpense({ ...newExpense, month: val })}
            />
            <Button onClick={handleAdd} className="w-full">
              Add Planned Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Planned Expenses List */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            title="Planned Expenses"
            description={`${expenses.length} planned expense${expenses.length !== 1 ? 's' : ''}`}
          />
          {expenses.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-12 h-12" />}
              title="No planned expenses"
              description="Plan ahead for big purchases or one-time expenses"
            />
          ) : (
            <div className="space-y-4">
              {sortedMonths.map((month) => {
                const isCurrentMonth = month === currentMonth;
                const isPastMonth = month < currentMonth;
                const monthTotal = groupedByMonth[month].reduce((sum, e) => sum + e.amount, 0);

                return (
                  <div key={month}>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-white/0 dark:bg-transparent backdrop-blur-sm py-1 border-b border-gray-100 dark:border-gray-800/50">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                        {formatDate(month + "-01", "month-year")}
                      </h4>
                      {isCurrentMonth && (
                        <Badge variant="info" size="sm">This Month</Badge>
                      )}
                      {isPastMonth && (
                        <Badge variant="neutral" size="sm">Past</Badge>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({monthTotal.toFixed(2)} {currency})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {groupedByMonth[month].map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ml-6 border border-transparent dark:border-gray-700/50"
                        >
                          {editingId === expense.id ? (
                            <div className="flex-1 grid grid-cols-3 gap-2 mr-2">
                              <FormField
                                id={`edit-name-${expense.id}`}
                                label="Name"
                                value={editData.name}
                                onChange={(val) => setEditData({ ...editData, name: val })}
                              />
                              <FormField
                                id={`edit-amount-${expense.id}`}
                                label="Amount"
                                type="number"
                                value={editData.amount}
                                onChange={(val) => setEditData({ ...editData, amount: val })}
                              />
                              <FormField
                                id={`edit-month-${expense.id}`}
                                label="Month"
                                type="month"
                                value={editData.month}
                                onChange={(val) => setEditData({ ...editData, month: val })}
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{expense.name}</p>
                              <CurrencyDisplay
                                amount={expense.amount}
                                currency={currency}
                                size="sm"
                                color="text-purple-600 dark:text-purple-400"
                              />
                            </div>
                          )}
                          <ActionButtons
                            isEditing={editingId === expense.id}
                            onEdit={() => startEdit(expense)}
                            onDelete={() => onDelete(expense.id)}
                            onSave={saveEdit}
                            onCancel={cancelEdit}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}