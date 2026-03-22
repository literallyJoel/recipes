import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const cardVariants = cva("bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "rounded-xl border shadow-sm",
      retro:
        "rounded-retro border-retro border-foreground bg-secondary shadow-retro-md",
      frame:
        "rounded-frame border-retro border-foreground bg-card shadow-retro-lg"
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
