import { useState } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon, PencilSquareIcon } from "@/assets/icons";

export function EditableInfoRow({
  label,
  value,
  className,
  onChange,
}: {
  label: string;
  value: string | number;
  className?: string;
  onChange?: (newValue: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(String(value));

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (onChange && editedValue !== String(value)) {
      onChange(editedValue);
    }
  };

  const cancelEdit = () => {
    setEditedValue(String(value));
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-5 dark:text-gray-6">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div>
            <div className="flex items-center gap-2">
              <input
                className={cn(
                  "rounded border border-gray-300 px-2 py-1 text-base font-semibold text-dark dark:bg-gray-800 dark:text-white",
                  className,
                )}
                value={editedValue}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
              />
              <CloseIcon
                className="h-4 w-4 cursor-pointer text-red-500"
                onMouseDown={(e) => e.preventDefault()} // Prevents input blur
                onClick={cancelEdit}
              />
            </div>
            <h6 className="text-sm text-gray-6 dark:text-gray-4">Click outside to save</h6>
          </div>
        ) : (
          <span className={cn("text-base font-semibold", className)}>
            ₹{value}
          </span>
        )}
        {!isEditing && (
          <PencilSquareIcon
            className="h-4 w-4 cursor-pointer text-blue-500"
            onClick={handleEditToggle}
          />
        )}
      </div>
    </div>
  );
}
