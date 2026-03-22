import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const cardVariants = cva("bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "rounded-xl border shadow-sm",
      retro:
        "rounded-[1.75rem] border-[3px] border-foreground bg-secondary shadow-[8px_8px_0_var(--foreground)]",
      frame:
        "rounded-[2rem] border-[3px] border-foreground bg-card shadow-[10px_10px_0_var(--foreground)]"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

type DivProps = React.ComponentProps<"div">;

type CardProps = DivProps & VariantProps<typeof cardVariants>;

export const Card = ({ className, variant, ...props }: CardProps) => (
  <div className={cn(cardVariants({ variant, className }))} {...props} />
);

export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cn("flex flex-col space-y-2", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: DivProps) => (
  <div className={cn("text-2xl font-semibold tracking-tight", className)} {...props} />
);

export const CardContent = ({ className, ...props }: DivProps) => (
  <div className={cn(className)} {...props} />
);
