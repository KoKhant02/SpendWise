/**
 * ActionButtons Molecule
 * Consistent edit/delete button group for list items
 */

import { Button } from "../ui/button";
import { Edit2, Trash2, Check, X } from "lucide-react";

interface ActionButtonsProps {
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  deleteConfirm?: boolean;
}

export function ActionButtons({
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  deleteConfirm = false
}: ActionButtonsProps) {
  if (isEditing) {
    return (
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="text-green-600 hover:text-green-700"
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-700"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
