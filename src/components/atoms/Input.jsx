import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-white border-2 rounded-lg transition-all duration-200",
        "text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
        error ? "border-error focus:ring-error focus:border-error" : "border-secondary/30",
        "disabled:bg-gray-100 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;