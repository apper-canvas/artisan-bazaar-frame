import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary",
    accent: "bg-gradient-to-r from-accent/10 to-accent/20 text-accent",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success",
    warning: "bg-gradient-to-r from-warning/10 to-warning/20 text-warning",
    error: "bg-gradient-to-r from-error/10 to-error/20 text-error",
    info: "bg-gradient-to-r from-info/10 to-info/20 text-info"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;