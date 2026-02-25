/**
 * SectionHeader Molecule
 * Consistent section titles with optional actions
 */

import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SectionHeader({
  icon,
  title,
  description,
  action
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button onClick={action.onClick} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
