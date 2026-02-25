/**
 * StatCard Atom
 * Displays a single statistic with label and value
 * Reusable for dashboard metrics
 */

interface StatCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  label,
  value,
  valueColor = "text-gray-900",
  icon,
  trend
}: StatCardProps) {
  const getTrendColor = () => {
    if (!trend) return "";
    return trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className={`text-xl font-bold ${valueColor} ${getTrendColor()}`}>
        {value}
      </p>
    </div>
  );
}
