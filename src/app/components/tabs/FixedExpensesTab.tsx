/**
 * FixedExpensesTab Component
 * Manages recurring fixed expenses (monthly/yearly)
 */

import { useState } from "react";
import { Repeat, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormField } from "../atoms/FormField";
import { ActionButtons } from "../molecules/ActionButtons";
import { SectionHeader } from "../molecules/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { CurrencyDisplay } from "../atoms/CurrencyDisplay";
import { Badge } from "../atoms/Badge";
import type { FixedExpense } from "../../types";

interface FixedExpensesTabProps {
  expenses: FixedExpense[];
  currency: string;
  onAdd: (expense: Omit<FixedExpense, "id">) => void;
  onUpdate: (id: number, expense: Omit<FixedExpense, "id">) => void;
  onDelete: (id: number) => void;
}

export function FixedExpensesTab({
  expenses,
  currency,
  onAdd,
  onUpdate,
  onDelete
}: FixedExpensesTabProps) {
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    frequency: "monthly" as "monthly" | "yearly"
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    amount: "",
    frequency: "monthly" as "monthly" | "yearly"
  });

  const handleAdd = () => {
    if (newExpense.name && newExpense.amount) {
      onAdd({
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        frequency: newExpense.frequency
      });
      setNewExpense({ name: "", amount: "", frequency: "monthly" });
    }
  };

  const startEdit = (expense: FixedExpense) => {
    setEditingId(expense.id);
    setEditData({
      name: expense.name,
      amount: expense.amount.toString(),
      frequency: expense.frequency
    });
  };

  const saveEdit = () => {
    if (editingId && editData.name && editData.amount) {
      onUpdate(editingId, {
        name: editData.name,
        amount: parseFloat(editData.amount),
        frequency: editData.frequency
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", amount: "", frequency: "monthly" });
  };

  // Calculate monthly equivalent
  const getMonthlyAmount = (expense: FixedExpense) => {
    return expense.frequency === "yearly" ? expense.amount / 12 : expense.amount;
  };

  const totalMonthly = expenses.reduce((sum, exp) => sum + getMonthlyAmount(exp), 0);

  return (
    <div className="space-y-6">
      {/* Total Display */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/80 dark:to-red-950/80 border-orange-200 dark:border-orange-800/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-gray-700 dark:text-orange-300">Total Monthly Fixed Expenses</span>
            </div>
            <CurrencyDisplay
              amount={totalMonthly}
              currency={currency}
              size="xl"
              color="text-orange-600 dark:text-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New Expense Form */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={<Repeat className="w-5 h-5 text-orange-600" />}
            title="Add Fixed Expense"
          />
          <div className="space-y-4">
            <FormField
              id="expense-name"
              label="Expense Name"
              value={newExpense.name}
              onChange={(val) => setNewExpense({ ...newExpense, name: val })}
              placeholder="e.g., Rent, Insurance, Utilities"
            />
            <FormField
              id="expense-amount"
              label={`Amount (${currency})`}
              type="number"
              value={newExpense.amount}
              onChange={(val) => setNewExpense({ ...newExpense, amount: val })}
              placeholder="0.00"
              min={0}
              step="0.01"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Frequency</label>
              <Select
                value={newExpense.frequency}
                onValueChange={(val: "monthly" | "yearly") =>
                  setNewExpense({ ...newExpense, frequency: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} className="w-full">
              Add Fixed Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            title="Fixed Expenses"
            description={`${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}
          />
          {expenses.length === 0 ? (
            <EmptyState
              icon={<Repeat className="w-12 h-12" />}
              title="No fixed expenses yet"
              description="Add recurring bills and subscriptions"
            />
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-transparent dark:border-gray-700/50"
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Frequency</label>
                        <Select
                          value={editData.frequency}
                          onValueChange={(val: "monthly" | "yearly") =>
                            setEditData({ ...editData, frequency: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-4">
                      <div>
                        <p className="font-medium dark:text-gray-100">{expense.name}</p>
                        <div className="flex items-center gap-2">
                          <CurrencyDisplay
                            amount={expense.amount}
                            currency={currency}
                            size="sm"
                            color="text-orange-600 dark:text-orange-400"
                          />
                          <Badge variant="info" size="sm">
                            {expense.frequency}
                          </Badge>
                          {expense.frequency === "yearly" && (
                            <span className="text-xs text-gray-500">
                              ({getMonthlyAmount(expense).toFixed(2)} {currency}/mo)
                            </span>
                          )}
                        </div>
                      </div>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}