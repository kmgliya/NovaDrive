import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[11px] font-semibold uppercase text-muted tracking-[0.25em] ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-full bg-white/5 border border-white/10 text-white px-5 py-3 outline-none transition-all",
            "focus:border-primary focus:ring-2 focus:ring-primary/40", // Оранжевая обводка при нажатии
            "placeholder:text-white/30",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";