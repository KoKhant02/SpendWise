/**
 * CurrencyDisplay Atom
 * Consistent currency formatting with optional styling
 */

import { formatCurrency } from "../../utils/formatters";

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  showSymbol?: boolean;
}

export function CurrencyDisplay({
  amount,
  currency,
  size = "md",
  color = "text-gray-900",
  showSymbol = true
}: CurrencyDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl"
  };

  const formattedAmount = formatCurrency(amount, currency, showSymbol);

  return (
    <span className={`font-semibold ${sizeClasses[size]} ${color}`}>
      {formattedAmount}
    </span>
  );
}
