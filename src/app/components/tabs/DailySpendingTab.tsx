/**
 * DailySpendingTab Component
 * Displays and manages daily spending history
 */

import { useState } from "react";
import { Receipt, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { FormField } from "../atoms/FormField";
import { ActionButtons } from "../molecules/ActionButtons";
import { SectionHeader } from "../molecules/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { CurrencyDisplay } from "../atoms/CurrencyDisplay";
import { formatDate } from "../../utils/formatters";
import type { DailySpending } from "../../types";

interface DailySpendingTabProps {
  spending: DailySpending[];
  currentMonth: string;
  currency: string;
  onUpdate: (id: number, expense: Omit<DailySpending, "id">) => void;
  onDelete: (id: number) => void;
}

export function DailySpendingTab({
  spending,
  currentMonth,
  currency,
  onUpdate,
  onDelete
}: DailySpendingTabProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    amount: "",
    description: "",
    date: ""
  });

  const startEdit = (expense: DailySpending) => {
    setEditingId(expense.id);
    setEditData({
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date
    });
  };

  const saveEdit = () => {
    if (editingId && editData.amount && editData.description && editData.date) {
      onUpdate(editingId, {
        amount: parseFloat(editData.amount),
        description: editData.description,
        date: editData.date
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ amount: "", description: "", date: "" });
  };

  // Filter current month spending
  const currentMonthSpending = spending.filter((s) => s.date.startsWith(currentMonth));
  const totalThisMonth = currentMonthSpending.reduce((sum, s) => sum + s.amount, 0);

  // Group by date
  const groupedByDate = currentMonthSpending.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = [];
    }
    acc[expense.date].push(expense);
    return acc;
  }, {} as Record<string, DailySpending[]>);

  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Total Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/80 dark:to-indigo-950/80 border-blue-200 dark:border-blue-800/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-700 dark:text-blue-300">Total Spent This Month</span>
            </div>
            <CurrencyDisplay
              amount={totalThisMonth}
              currency={currency}
              size="xl"
              color="text-blue-600 dark:text-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Spending History */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            title="Spending History"
            description={`${currentMonthSpending.length} transaction${currentMonthSpending.length !== 1 ? 's' : ''} this month`}
          />
          {currentMonthSpending.length === 0 ? (
            <EmptyState
              icon={<Receipt className="w-12 h-12" />}
              title="No spending tracked yet"
              description="Use the quick add feature on the dashboard to track expenses"
            />
          ) : (
            <div className="space-y-4">
              {sortedDates.map((date) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2 sticky top-0 bg-white/0 dark:bg-transparent backdrop-blur-sm py-1 border-b border-gray-100 dark:border-gray-800/50">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      {formatDate(date, "long")}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({groupedByDate[date].reduce((sum, s) => sum + s.amount, 0).toFixed(2)} {currency})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {groupedByDate[date].map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ml-6 border border-transparent dark:border-gray-700/50"
                      >
                        {editingId === expense.id ? (
                          <div className="flex-1 grid grid-cols-3 gap-2 mr-2">
                            <FormField
                              id={`edit-desc-${expense.id}`}
                              label="Description"
                              value={editData.description}
                              onChange={(val) => setEditData({ ...editData, description: val })}
                            />
                            <FormField
                              id={`edit-amount-${expense.id}`}
                              label="Amount"
                              type="number"
                              value={editData.amount}
                              onChange={(val) => setEditData({ ...editData, amount: val })}
                            />
                            <FormField
                              id={`edit-date-${expense.id}`}
                              label="Date"
                              type="date"
                              value={editData.date}
                              onChange={(val) => setEditData({ ...editData, date: val })}
                            />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</p>
                            <CurrencyDisplay
                              amount={expense.amount}
                              currency={currency}
                              size="sm"
                              color="text-blue-600 dark:text-blue-400"
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}