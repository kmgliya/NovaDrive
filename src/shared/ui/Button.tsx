import { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
        "text-xs font-semibold uppercase tracking-[0.25em]",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        // Стили вариантов
        variant === 'primary' && "bg-primary text-white hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(255,95,0,0.45)]",
        variant === 'outline' && "border border-white/25 text-white bg-transparent hover:border-white hover:bg-white/5",
        variant === 'ghost' && "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}
    />
  );
};