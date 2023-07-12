import { ReactNode } from "react";

interface SelectionButtonProps {
  children: ReactNode;
  selected: boolean;
  grade?: any;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  children,
  selected,
}) => {
  return (
    <label
      className={`flex flex-col border border-gray-400 shadow px-4 lg:px-12 py-2  rounded text-center w-1/3 ${
        selected && "bg-gray-200 font-semibold"
      }`}
    >
      {children}
    </label>
  );
};

export default SelectionButton;
