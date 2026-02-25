import { useState } from "react";
import { TrendingDown, AlertTriangle, Plus, Wallet, AlertCircle, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Settings } from "../types";

interface HeroDashboardProps {
  dailyUsableAmount: number;
  spentToday: number;
  daysRemaining: number;
  isAtRisk: boolean;
  onAddExpense: (amount: number, description: string) => void;
  currency: string;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

export function HeroDashboard({
  dailyUsableAmount,
  spentToday,
  daysRemaining,
  isAtRisk,
  onAddExpense,
  currency,
  settings,
  onUpdateSettings,
}: HeroDashboardProps) {
  const [quickAmount, setQuickAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleQuickAdd = () => {
    const amount = parseFloat(quickAmount);
    if (amount && amount > 0) {
      onAddExpense(amount, description);
      setQuickAmount("");
      setDescription("");
    }
  };

  // Calculate daily savings amount based on type
  const calculateDailySavings = () => {
    if (settings.savingsGoalType === "daily") {
      return settings.savingsGoal;
    } else if (settings.savingsGoalType === "monthly") {
      return settings.savingsGoal / 30;
    } else {
      // yearly
      return settings.savingsGoal / 365;
    }
  };

  const dailySavingsAmount = calculateDailySavings();

  // Now dailyUsableAmount already represents the budget at the START of today
  // (because we calculate it with spentThisMonth - spentToday in App.tsx)
  // So we can use it directly without any reverse calculation
  const todaysBudget = dailyUsableAmount;
  
  // Today's remaining budget = what you started with today minus what you've spent
  const todaysRemaining = Math.max(todaysBudget - spentToday, 0);

  // Progress bar should show spending against the original budget for today
  const percentageSpent = todaysBudget > 0 
    ? Math.min((spentToday / todaysBudget) * 100, 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Main Budget Display */}
      <Card className={`border-2 ${
        isAtRisk 
          ? 'border-red-500 bg-red-50 dark:bg-red-950/80 dark:border-red-800/60' 
          : 'border-green-500 bg-green-50 dark:bg-green-950/80 dark:border-green-800/60'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className={`w-8 h-8 ${
              isAtRisk 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`} />
            <h2 className="text-lg text-gray-600 dark:text-gray-300">Today's Budget</h2>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-5xl font-bold ${
              isAtRisk 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {dailyUsableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-2xl text-gray-500 dark:text-gray-400">{currency}</span>
          </div>

          {isAtRisk && (
            <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800/60 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                ⚠️ Savings Goal at Risk! Reduce spending or adjust commitments.
              </p>
            </div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in month
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Today's Spending</span>
              </div>
              <span className="text-sm text-gray-500">
                {spentToday.toLocaleString()} / {todaysBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </span>
            </div>

            <Progress value={percentageSpent} className="h-3" />

            <div className="flex justify-between text-sm">
              <span className={`font-semibold ${
                todaysRemaining === 0 
                  ? 'text-red-600' 
                  : 'text-green-600'
              }`}>
                {todaysRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency} remaining
              </span>
              <span className="text-gray-500">{percentageSpent.toFixed(1)}% used</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Expense */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Track Daily Expense
          </h3>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="What did you buy? (e.g., taxi fees, medicine)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Amount in ${currency}`}
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                className="flex-1"
              />
              <Button onClick={handleQuickAdd} disabled={!quickAmount || parseFloat(quickAmount) <= 0}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goal */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">Savings Target</h3>
            </div>

            {/* Savings Goal Type Selector */}
            <div>
              <Label htmlFor="savingsType" className="mb-2 block">Target Type</Label>
              <Select
                value={settings.savingsGoalType}
                onValueChange={(value: "daily" | "monthly" | "yearly") =>
                  onUpdateSettings({ ...settings, savingsGoalType: value })
                }
              >
                <SelectTrigger id="savingsType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Savings Goal Amount */}
            <div>
              <Label htmlFor="savings" className="mb-2 block">
                {settings.savingsGoalType === "daily" ? "Daily" : settings.savingsGoalType === "monthly" ? "Monthly" : "Yearly"} Savings Target ({currency})
              </Label>
              <Input
                id="savings"
                type="number"
                value={settings.savingsGoal}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, savingsGoal: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            {/* Display Daily Savings Amount */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/60 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-purple-300">Daily Savings Amount:</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {dailySavingsAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-purple-400/80 mt-1">This amount is protected from your daily budget</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}