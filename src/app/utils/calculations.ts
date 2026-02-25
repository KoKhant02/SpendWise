interface FixedExpense {
  id: number;
  name: string;
  amount: number;
  frequency: "monthly" | "yearly";
}

interface OneTimePlanned {
  id: number;
  name: string;
  amount: number;
  month: string;
}

interface DailySpending {
  id: number;
  amount: number;
  date: string;
}

/**
 * Calculates the total monthly commitment including:
 * - Savings goal (converted to monthly based on type)
 * - Fixed expenses (converted to monthly)
 * - One-time planned expenses for the current month
 */
export function calculateMonthlyCommitment(
  savingsGoal: number,
  fixedExpenses: FixedExpense[],
  oneTimePlanned: OneTimePlanned[],
  currentMonth: string, // Format: "YYYY-MM"
  savingsGoalType: "daily" | "monthly" | "yearly" = "monthly"
): number {
  // Convert savings goal to monthly
  let monthlySavings = savingsGoal;
  if (savingsGoalType === "daily") {
    // Daily * 30 days = monthly
    monthlySavings = savingsGoal * 30;
  } else if (savingsGoalType === "yearly") {
    // Yearly / 12 months = monthly
    monthlySavings = savingsGoal / 12;
  }

  // Sum fixed expenses (convert yearly to monthly)
  const fixedTotal = fixedExpenses.reduce((sum, expense) => {
    const monthlyAmount = expense.frequency === "yearly" 
      ? expense.amount / 12 
      : expense.amount;
    return sum + monthlyAmount;
  }, 0);

  // Sum one-time expenses for current month
  const oneTimeTotal = oneTimePlanned
    .filter(expense => expense.month === currentMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return monthlySavings + fixedTotal + oneTimeTotal;
}

/**
 * Calculates the Daily Usable Amount (DUA)
 * Formula: (Income - Commitment - SpentBeforeToday) / DaysRemainingInMonth
 * Note: SpentBeforeToday should exclude today's spending to get the budget at START of day
 */
export function calculateDailyUsableAmount(
  income: number,
  commitment: number,
  spentBeforeToday: number,
  daysRemaining: number
): number {
  if (daysRemaining <= 0) return 0;
  
  const remaining = income - commitment - spentBeforeToday;
  return remaining / daysRemaining;
}

/**
 * Calculates total spent in the current month
 */
export function calculateSpentThisMonth(
  dailySpending: DailySpending[],
  currentMonth: string // Format: "YYYY-MM"
): number {
  return dailySpending
    .filter(spending => spending.date.startsWith(currentMonth))
    .reduce((sum, spending) => sum + spending.amount, 0);
}

/**
 * Calculates total spent today
 */
export function calculateSpentToday(
  dailySpending: DailySpending[],
  today: string // Format: "YYYY-MM-DD"
): number {
  return dailySpending
    .filter(spending => spending.date === today)
    .reduce((sum, spending) => sum + spending.amount, 0);
}

/**
 * Gets the current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Calculates the number of days remaining in the current month (including today)
 */
export function getDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  return lastDayOfMonth - today + 1;
}

/**
 * Converts savings goal to daily amount based on type
 */
export function calculateDailySavingsAmount(
  savingsGoal: number,
  savingsGoalType: "daily" | "monthly" | "yearly"
): number {
  if (savingsGoalType === "daily") {
    return savingsGoal;
  } else if (savingsGoalType === "monthly") {
    return savingsGoal / 30;
  } else {
    // yearly
    return savingsGoal / 365;
  }
}