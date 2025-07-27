import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@/components/ui/dropdown"; // adjust path if needed

type RoleDropdownProps = {
  selected: string;
  onSelect: (value: string) => void;
};

export default function RoleDropdown({ selected, onSelect }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(selected || "Select Role");

  useEffect(() => {
    setSelectedRole(selected);
  }, [selected]);

  const handleSelect = (role: string) => {
    setSelectedRole(role);
    onSelect(role); // propagate up
    setIsOpen(false); // manually close dropdown
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger type="button" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-left text-dark placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
        {selectedRole || "Select Role"}
      </DropdownTrigger>

      <DropdownContent className="z-50 bg-white shadow-md dark:bg-dark-2">
        <ul className="space-y-1 p-2">
          {["SUPER_ADMIN", "CITY_ADMIN", "SETTLEMENT_MANAGER"].map((role) => (
            <li
              key={role}
              className="cursor-pointer rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-3"
              onClick={() => handleSelect(role)}
            >
              {role}
            </li>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  );
}
