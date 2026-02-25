import { HeroDashboard } from "./components/HeroDashboard";
import { FinancialBlueprint } from "./components/FinancialBlueprint";
import { ThemeToggle } from "./components/atoms/ThemeToggle";
import { useSpendWiseState } from "./hooks/useSpendWiseState";
import { useIncomeManager } from "./hooks/useIncomeManager";
import { useExpenseManager } from "./hooks/useExpenseManager";
import { useLoanManager } from "./hooks/useLoanManager";
import { useCalculations } from "./hooks/useCalculations";
import { useSimulator } from "./hooks/useSimulator";
import { useTheme } from "./hooks/useTheme";
import { formatCurrency } from "./utils/formatters";

function App() {
  // Theme Management
  const { isDark, toggleTheme } = useTheme();
  
  // State Management
  const { state, setState, updateSettings } = useSpendWiseState();
  
  // Domain Managers
  const incomes = useIncomeManager(state, setState);
  const expenses = useExpenseManager(state, setState);
  const loans = useLoanManager(state, setState);
  
  // Calculations
  const calculations = useCalculations(state);
  
  // Simulator
  const simulator = useSimulator(
    calculations.monthlyIncome,
    calculations.commitment,
    calculations.spentThisMonth,
    calculations.spentToday,
    calculations.daysRemaining,
    calculations.baseDailyUsableAmount
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                SpendWise
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Smart daily budget calculator
              </p>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hero Dashboard */}
          <div className="lg:col-span-1 space-y-6">
            <HeroDashboard
              dailyUsableAmount={simulator.displayDUA}
              spentToday={calculations.spentToday}
              daysRemaining={calculations.daysRemaining}
              isAtRisk={calculations.isAtRisk}
              onAddExpense={expenses.addDaily}
              currency={state.settings.currency}
              settings={state.settings}
              onUpdateSettings={updateSettings}
            />
          </div>

          {/* Right Column - Financial Blueprint */}
          <div className="lg:col-span-2">
            {/* Monthly Overview */}
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
              <h3 className="font-semibold text-lg mb-4 dark:text-white">📊 Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Income</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(calculations.monthlyIncome, state.settings.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Commitment</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(calculations.commitment, state.settings.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Spent This Month</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculations.spentThisMonth, state.settings.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available Budget</p>
                  <p className={`text-xl font-bold ${calculations.availableBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(calculations.availableBudget, state.settings.currency)}
                  </p>
                </div>
              </div>
            </div>

            <FinancialBlueprint
              settings={state.settings}
              incomes={state.incomes}
              fixedExpenses={state.fixedExpenses}
              oneTimePlanned={state.oneTimePlanned}
              dailySpending={state.dailySpending}
              loans={state.loans}
              currentMonth={calculations.currentMonth}
              onUpdateSettings={updateSettings}
              onAddIncome={incomes.add}
              onUpdateIncome={incomes.update}
              onDeleteIncome={incomes.remove}
              onAddFixedExpense={expenses.addFixed}
              onUpdateFixedExpense={expenses.updateFixed}
              onDeleteFixedExpense={expenses.removeFixed}
              onAddOneTime={expenses.addOneTime}
              onUpdateOneTime={expenses.updateOneTime}
              onDeleteOneTime={expenses.removeOneTime}
              onUpdateExpense={expenses.updateDaily}
              onDeleteExpense={expenses.removeDaily}
              onAddLoan={loans.add}
              onPushLoanMonth={loans.pushMonth}
              onMarkLoanPaid={loans.markPaid}
              onWriteOffLoan={loans.writeOff}
              onDeleteLoan={loans.remove}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Data is saved locally in your browser. No account required! 🔒</p>
        </footer>
      </div>
    </div>
  );
}

export default App;