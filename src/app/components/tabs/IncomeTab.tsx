/**
 * IncomeTab Component
 * Manages income sources list and forms
 */

import { useState } from "react";
import { DollarSign, Wallet } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FormField } from "../atoms/FormField";
import { ActionButtons } from "../molecules/ActionButtons";
import { SectionHeader } from "../molecules/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { CurrencyDisplay } from "../atoms/CurrencyDisplay";
import type { Income } from "../../types";

interface IncomeTabProps {
  incomes: Income[];
  currency: string;
  onAdd: (income: Omit<Income, "id">) => void;
  onUpdate: (id: number, income: Omit<Income, "id">) => void;
  onDelete: (id: number) => void;
}

export function IncomeTab({
  incomes,
  currency,
  onAdd,
  onUpdate,
  onDelete
}: IncomeTabProps) {
  const [newIncome, setNewIncome] = useState({ amount: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ amount: "", description: "" });

  const handleAdd = () => {
    if (newIncome.amount && newIncome.description) {
      onAdd({
        amount: parseFloat(newIncome.amount),
        description: newIncome.description
      });
      setNewIncome({ amount: "", description: "" });
    }
  };

  const startEdit = (income: Income) => {
    setEditingId(income.id);
    setEditData({
      amount: income.amount.toString(),
      description: income.description
    });
  };

  const saveEdit = () => {
    if (editingId && editData.amount && editData.description) {
      onUpdate(editingId, {
        amount: parseFloat(editData.amount),
        description: editData.description
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ amount: "", description: "" });
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="space-y-6">
      {/* Total Income Display */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/80 dark:to-emerald-950/80 border-green-200 dark:border-green-800/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-700 dark:text-green-300">Total Monthly Income</span>
            </div>
            <CurrencyDisplay
              amount={totalIncome}
              currency={currency}
              size="xl"
              color="text-green-600 dark:text-green-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New Income Form */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            title="Add Income Source"
          />
          <div className="space-y-4">
            <FormField
              id="income-description"
              label="Source Description"
              value={newIncome.description}
              onChange={(val) => setNewIncome({ ...newIncome, description: val })}
              placeholder="e.g., Salary, Freelance, Business"
            />
            <FormField
              id="income-amount"
              label={`Monthly Amount (${currency})`}
              type="number"
              value={newIncome.amount}
              onChange={(val) => setNewIncome({ ...newIncome, amount: val })}
              placeholder="0.00"
              min={0}
              step="0.01"
            />
            <Button onClick={handleAdd} className="w-full">
              Add Income Source
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Income List */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            title="Income Sources"
            description={`${incomes.length} source${incomes.length !== 1 ? 's' : ''}`}
          />
          {incomes.length === 0 ? (
            <EmptyState
              icon={<DollarSign className="w-12 h-12" />}
              title="No income sources yet"
              description="Add your first income source to get started"
            />
          ) : (
            <div className="space-y-2">
              {incomes.map((income) => (
                <div
                  key={income.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-transparent dark:border-gray-700/50"
                >
                  {editingId === income.id ? (
                    <div className="flex-1 grid grid-cols-2 gap-2 mr-2">
                      <FormField
                        id={`edit-desc-${income.id}`}
                        label="Description"
                        value={editData.description}
                        onChange={(val) => setEditData({ ...editData, description: val })}
                      />
                      <FormField
                        id={`edit-amount-${income.id}`}
                        label="Amount"
                        type="number"
                        value={editData.amount}
                        onChange={(val) => setEditData({ ...editData, amount: val })}
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="font-medium dark:text-gray-100">{income.description}</p>
                      <CurrencyDisplay
                        amount={income.amount}
                        currency={currency}
                        size="sm"
                        color="text-green-600 dark:text-green-400"
                      />
                    </div>
                  )}
                  <ActionButtons
                    isEditing={editingId === income.id}
                    onEdit={() => startEdit(income)}
                    onDelete={() => onDelete(income.id)}
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