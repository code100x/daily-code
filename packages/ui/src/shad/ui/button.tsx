import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:shadow-medium hover:bg-primary/90 hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:shadow-medium hover:bg-destructive/90 hover:-translate-y-0.5",
        outline: "border border-input bg-background shadow-soft hover:shadow-medium hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:shadow-medium hover:bg-secondary/80 hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
        explore: "bg-primary text-primary-foreground shadow-soft hover:shadow-medium hover:bg-primary/90 hover:-translate-y-0.5",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
