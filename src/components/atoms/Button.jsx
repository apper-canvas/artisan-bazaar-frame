import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary",
  size = "md",
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary",
    accent: "bg-gradient-to-r from-accent to-accent/90 text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-accent",
    secondary: "border-2 border-secondary text-primary hover:bg-surface hover:-translate-y-0.5 focus:ring-secondary",
    ghost: "text-primary hover:bg-surface hover:-translate-y-0.5",
    danger: "bg-gradient-to-r from-error to-error/90 text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-error"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;