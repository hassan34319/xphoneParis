import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { BiDollar, BiHide, BiShow } from "react-icons/bi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  watch,
  required,
  errors,
}) => {
  const isEmail = type === "email";
  const isPassword = id === "password";
  const isConfirmPassword = id === "confirmPassword";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const errorMessage = errors[id]?.message;
  const getInputType = () => {
    if ((isPassword || isConfirmPassword) && !isPasswordVisible) {
      return "password";
    }
    return type;
  };
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, {
          required,
          ...(isEmail && {
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: "Email address must be a valid address",
            },
          }),
          ...(isConfirmPassword && {
            validate: (value) =>
              value === watch("password") ||
              "Confirm password must be the same as the password",
          }),
        })}
        placeholder=" "
        type={getInputType()}
        className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      <label
        className={`
          absolute 
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
      {(isPassword || isConfirmPassword)  && (
        <span
          className="absolute top-5 right-2 cursor-pointer"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? <BiHide className="text-2xl lg:text-3xl " /> : <BiShow  className="text-2xl lg:text-3xl "/>}
        </span>
      )}
      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage.toString()}</span>
      )}
    </div>
  );
};

export default Input;
