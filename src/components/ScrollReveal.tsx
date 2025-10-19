import { ReactNode } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { cn } from "../lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export const ScrollReveal = ({ 
  children, 
  className,
  delay = 0,
  direction = "up" 
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const getAnimationClass = () => {
    switch (direction) {
      case "up":
        return isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-20 opacity-0";
      case "down":
        return isVisible 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-20 opacity-0";
      case "left":
        return isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-20 opacity-0";
      case "right":
        return isVisible 
          ? "translate-x-0 opacity-100" 
          : "-translate-x-20 opacity-0";
      case "scale":
        return isVisible 
          ? "scale-100 opacity-100" 
          : "scale-95 opacity-0";
      default:
        return isVisible ? "opacity-100" : "opacity-0";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        getAnimationClass(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
