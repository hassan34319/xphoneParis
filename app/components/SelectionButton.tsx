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
      className={`flex flex-col border border-gray-400 shadow px-2 lg:px-4 py-1  rounded text-center justify-between text-sm lg:w-[33%] w-full ${
        selected && "bg-gray-200 font-semibold"
      }`}
    >
      {children}
    </label>
  );
};

export default SelectionButton;
