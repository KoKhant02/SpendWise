/**
 * LoansTab Component
 * Manages friend loans with interest calculations
 */

import { useState } from "react";
import { HandCoins, ArrowRight, Ban, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormField } from "../atoms/FormField";
import { SectionHeader } from "../molecules/SectionHeader";
import { EmptyState } from "../atoms/EmptyState";
import { CurrencyDisplay } from "../atoms/CurrencyDisplay";
import { Badge } from "../atoms/Badge";
import { formatDate } from "../../utils/formatters";
import { LoanCalculator } from "../../services/loanCalculator";
import type { Loan } from "../../types";

interface LoansTabProps {
  loans: Loan[];
  currency: string;
  currentMonth: string;
  onAdd: (loanData: {
    friendName: string;
    principal: number;
    interestRate: number;
    interestType: "simple" | "compound";
    expectedReturnDate: string;
    notes?: string;
  }) => void;
  onPushMonth: (loanId: number) => void;
  onMarkPaid: (loanId: number, actualAmount?: number) => void;
  onWriteOff: (loanId: number) => void;
  onDelete: (loanId: number) => void;
}

export function LoansTab({
  loans,
  currency,
  currentMonth,
  onAdd,
  onPushMonth,
  onMarkPaid,
  onWriteOff,
  onDelete
}: LoansTabProps) {
  const [newLoan, setNewLoan] = useState({
    friendName: "",
    principal: "",
    interestRate: "",
    interestType: "simple" as "simple" | "compound",
    expectedReturnDate: "",
    notes: ""
  });
  const [markingPaidId, setMarkingPaidId] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const handleAdd = () => {
    if (newLoan.friendName && newLoan.principal && newLoan.expectedReturnDate) {
      onAdd({
        friendName: newLoan.friendName,
        principal: parseFloat(newLoan.principal),
        interestRate: parseFloat(newLoan.interestRate) || 0,
        interestType: newLoan.interestType,
        expectedReturnDate: newLoan.expectedReturnDate,
        notes: newLoan.notes || undefined
      });
      setNewLoan({
        friendName: "",
        principal: "",
        interestRate: "",
        interestType: "simple",
        expectedReturnDate: "",
        notes: ""
      });
    }
  };

  const handleMarkPaid = (loanId: number) => {
    const amount = customAmount ? parseFloat(customAmount) : undefined;
    onMarkPaid(loanId, amount);
    setMarkingPaidId(null);
    setCustomAmount("");
  };

  const pendingLoans = loans.filter(l => l.status === "pending");
  const paidLoans = loans.filter(l => l.status === "paid");
  const writtenOffLoans = loans.filter(l => l.status === "written-off");

  const totalLent = pendingLoans.reduce((sum, l) => sum + l.principal, 0);
  const totalExpected = pendingLoans.reduce((sum, l) => sum + l.expectedAmount, 0);
  
  // Calculate this month's expected return
  const thisMonthLoans = pendingLoans.filter(l => l.expectedReturnDate.startsWith(currentMonth));
  const thisMonthExpected = thisMonthLoans.reduce((sum, l) => sum + l.expectedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Lent Card */}
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/80 dark:to-amber-950/80 border-yellow-200 dark:border-yellow-800/60">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <HandCoins className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Lent</span>
                </div>
                <CurrencyDisplay
                  amount={totalLent}
                  currency={currency}
                  size="lg"
                  color="text-yellow-700 dark:text-yellow-300 font-bold text-3xl"
                />
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
                <HandCoins className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expected Return Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/80 dark:to-emerald-950/80 border-green-200 dark:border-green-800/60">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-sm font-medium">Expected Return</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total (All Months)</div>
                    <CurrencyDisplay
                      amount={totalExpected}
                      currency={currency}
                      size="lg"
                      color="text-green-700 dark:text-green-300 font-bold text-2xl"
                    />
                  </div>
                  
                  <div className="pt-2 border-t border-green-200 dark:border-green-800/40">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">This Month</div>
                    <CurrencyDisplay
                      amount={thisMonthExpected}
                      currency={currency}
                      size="md"
                      color="text-green-600 dark:text-green-400 font-semibold text-xl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                <ArrowRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Loan */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={<HandCoins className="w-5 h-5 text-yellow-600" />}
            title="Lend Money to Friend"
          />
          <div className="space-y-4">
            <FormField
              id="loan-friend"
              label="Friend's Name"
              value={newLoan.friendName}
              onChange={(val) => setNewLoan({ ...newLoan, friendName: val })}
              placeholder="e.g., John Smith"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="loan-principal"
                label={`Amount to Lend (${currency})`}
                type="number"
                value={newLoan.principal}
                onChange={(val) => setNewLoan({ ...newLoan, principal: val })}
                placeholder="0.00"
                min={0}
                step="0.01"
                required
              />
              <FormField
                id="loan-return-date"
                label="Expected Return Date"
                type="date"
                value={newLoan.expectedReturnDate}
                onChange={(val) => setNewLoan({ ...newLoan, expectedReturnDate: val })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="loan-interest"
                label="Monthly Interest Rate (%)"
                type="number"
                value={newLoan.interestRate}
                onChange={(val) => setNewLoan({ ...newLoan, interestRate: val })}
                placeholder="0"
                min={0}
                step="0.1"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Interest Type</label>
                <Select
                  value={newLoan.interestType}
                  onValueChange={(val: "simple" | "compound") =>
                    setNewLoan({ ...newLoan, interestType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple Interest</SelectItem>
                    <SelectItem value="compound">Compound Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormField
              id="loan-notes"
              label="Notes (Optional)"
              value={newLoan.notes}
              onChange={(val) => setNewLoan({ ...newLoan, notes: val })}
              placeholder="Any additional information..."
            />
            <Button onClick={handleAdd} className="w-full">
              Lend Money
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Loans */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            title="Pending Loans"
            description={`${pendingLoans.length} active loan${pendingLoans.length !== 1 ? 's' : ''}`}
          />
          {pendingLoans.length === 0 ? (
            <EmptyState
              icon={<HandCoins className="w-12 h-12" />}
              title="No pending loans"
              description="Lend money to friends and track repayments with interest"
            />
          ) : (
            <div className="space-y-4">
              {pendingLoans.map((loan) => {
                const interest = LoanCalculator.calculateInterest(loan.principal, loan.expectedAmount);
                const isPastDue = new Date(loan.expectedReturnDate) < new Date();

                return (
                  <div
                    key={loan.id}
                    className={`p-4 rounded-lg border-2 ${isPastDue ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800/60' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg dark:text-gray-100">{loan.friendName}</h4>
                        {loan.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{loan.notes}</p>
                        )}
                      </div>
                      {isPastDue && (
                        <Badge variant="danger">Overdue</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Lent Amount</p>
                        <CurrencyDisplay
                          amount={loan.principal}
                          currency={currency}
                          size="md"
                          color="text-yellow-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected Return</p>
                        <CurrencyDisplay
                          amount={loan.expectedAmount}
                          currency={currency}
                          size="md"
                          color="text-green-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest</p>
                        <CurrencyDisplay
                          amount={interest}
                          currency={currency}
                          size="sm"
                          color="text-blue-600"
                        />
                        <span className="text-xs text-gray-500 ml-1">
                          ({loan.interestRate}% {loan.interestType})
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Return Date</p>
                        <p className="text-sm font-semibold">{formatDate(loan.expectedReturnDate, "short")}</p>
                        <p className="text-xs text-gray-500">Lent: {formatDate(loan.lentDate, "short")}</p>
                      </div>
                    </div>

                    {markingPaidId === loan.id ? (
                      <div className="space-y-2">
                        <FormField
                          id={`custom-amount-${loan.id}`}
                          label="Actual Amount Received (leave empty for expected amount)"
                          type="number"
                          value={customAmount}
                          onChange={setCustomAmount}
                          placeholder={loan.expectedAmount.toString()}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleMarkPaid(loan.id)} size="sm" className="flex-1">
                            Confirm Payment
                          </Button>
                          <Button
                            onClick={() => {
                              setMarkingPaidId(null);
                              setCustomAmount("");
                            }}
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        <Button
                          onClick={() => setMarkingPaidId(loan.id)}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Paid
                        </Button>
                        <Button
                          onClick={() => onPushMonth(loan.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Calendar className="w-4 h-4" />
                          Push +1 Month
                        </Button>
                        <Button
                          onClick={() => onWriteOff(loan.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-red-600"
                        >
                          <Ban className="w-4 h-4" />
                          Write Off
                        </Button>
                        <Button
                          onClick={() => onDelete(loan.id)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-600"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Loans */}
      {(paidLoans.length > 0 || writtenOffLoans.length > 0) && (
        <Card>
          <CardContent className="pt-6">
            <SectionHeader
              title="Completed Loans"
              description={`${paidLoans.length} paid • ${writtenOffLoans.length} written off`}
            />
            <div className="space-y-3">
              {[...paidLoans, ...writtenOffLoans].map((loan) => (
                <div
                  key={loan.id}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{loan.friendName}</p>
                      <Badge variant={loan.status === "paid" ? "success" : "neutral"} size="sm">
                        {loan.status === "paid" ? "Paid" : "Written Off"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        Lent: <CurrencyDisplay amount={loan.principal} currency={currency} size="sm" />
                      </span>
                      {loan.status === "paid" && (
                        <span className="text-sm text-green-600">
                          Returned: <CurrencyDisplay amount={loan.expectedAmount} currency={currency} size="sm" />
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => onDelete(loan.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}