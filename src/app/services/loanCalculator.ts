/**
 * Loan Calculator Service
 * Pure business logic for loan calculations - separated from UI layer
 * Testable, reusable, and maintainable
 */

export interface LoanCalculationInput {
  principal: number;
  interestRate: number;
  interestType: "simple" | "compound";
  lentDate: string;
  returnDate: string;
}

export class LoanCalculator {
  /**
   * Calculates the number of complete months between two dates
   * @param startDate - Start date (ISO string)
   * @param endDate - End date (ISO string)
   * @returns Number of complete months (0 if same month, 1 if next month, etc.)
   */
  static calculateMonthsDifference(startDate: string, endDate: string): number {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    const yearsDiff = endDateObj.getFullYear() - startDateObj.getFullYear();
    const monthsDiff = endDateObj.getMonth() - startDateObj.getMonth();
    const totalMonthsDiff = yearsDiff * 12 + monthsDiff;
    
    return Math.max(0, totalMonthsDiff);
  }

  /**
   * Calculates the expected return amount with interest
   * @param principal - Original loan amount
   * @param interestRate - Monthly interest rate (as percentage, e.g., 5 for 5%)
   * @param months - Number of months
   * @param interestType - "simple" or "compound"
   * @returns Expected return amount
   */
  static calculateExpectedAmount(
    principal: number,
    interestRate: number,
    months: number,
    interestType: "simple" | "compound"
  ): number {
    // No interest if rate is 0 or duration is 0
    if (interestRate <= 0 || months <= 0) {
      return principal;
    }

    const rate = interestRate / 100;

    if (interestType === "simple") {
      // Simple Interest: A = P(1 + rt)
      return principal * (1 + rate * months);
    } else {
      // Compound Interest: A = P(1 + r)^t
      return principal * Math.pow(1 + rate, months);
    }
  }

  /**
   * Calculates expected amount from loan input
   * Convenience method that combines month calculation and interest calculation
   * @param input - Loan calculation input
   * @returns Expected return amount
   */
  static calculateLoanExpectedAmount(input: LoanCalculationInput): number {
    const months = this.calculateMonthsDifference(input.lentDate, input.returnDate);
    return this.calculateExpectedAmount(
      input.principal,
      input.interestRate,
      months,
      input.interestType
    );
  }

  /**
   * Calculates a new return date by pushing it forward N months
   * @param currentReturnDate - Current return date (ISO string)
   * @param monthsToAdd - Number of months to add (default: 1)
   * @returns New return date (ISO string)
   */
  static pushReturnDate(currentReturnDate: string, monthsToAdd: number = 1): string {
    const date = new Date(currentReturnDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculates the interest earned on a loan
   * @param principal - Original loan amount
   * @param expectedAmount - Expected return amount
   * @returns Interest amount
   */
  static calculateInterest(principal: number, expectedAmount: number): number {
    return expectedAmount - principal;
  }
}
