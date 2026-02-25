/**
 * Custom hook for What-If Simulator logic
 * Manages simulator state and calculations
 */

import { useState, useMemo } from "react";
import { calculateDailyUsableAmount } from "../utils/calculations";

export interface SimulatorState {
  isActive: boolean;
  simulatedAmount: number | null;
  simulatedDailyUsableAmount: number;
}

export interface SimulatorControls {
  toggle: (active: boolean) => void;
  simulate: (amount: number | null) => void;
  displayDUA: number;
}

export function useSimulator(
  monthlyIncome: number,
  commitment: number,
  spentThisMonth: number,
  spentToday: number,
  daysRemaining: number,
  baseDailyUsableAmount: number
): SimulatorControls {
  const [isActive, setIsActive] = useState(false);
  const [simulatedAmount, setSimulatedAmount] = useState<number | null>(null);

  // Calculate simulated daily usable amount
  const simulatedDailyUsableAmount = useMemo(() => {
    if (!isActive || simulatedAmount === null) {
      return baseDailyUsableAmount;
    }
    return calculateDailyUsableAmount(
      monthlyIncome,
      commitment,
      spentThisMonth - spentToday + simulatedAmount, // Simulate adding expense but still exclude today's actual spending
      daysRemaining
    );
  }, [isActive, simulatedAmount, baseDailyUsableAmount, monthlyIncome, commitment, spentThisMonth, spentToday, daysRemaining]);

  const handleToggle = (active: boolean) => {
    setIsActive(active);
    if (!active) {
      setSimulatedAmount(null);
    }
  };

  const handleSimulate = (amount: number | null) => {
    setSimulatedAmount(amount);
  };

  // Determine which DUA to display
  const displayDUA = isActive && simulatedAmount !== null 
    ? simulatedDailyUsableAmount 
    : baseDailyUsableAmount;

  return {
    toggle: handleToggle,
    simulate: handleSimulate,
    displayDUA
  };
}
