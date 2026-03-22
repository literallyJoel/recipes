import * as React from "react";
import { createLink, type LinkComponentProps } from "@tanstack/react-router";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import variants from "./variants";

type StyledAnchorProps = React.ComponentPropsWithoutRef<"a"> &
  VariantProps<typeof variants>;

const StyledAnchor = React.forwardRef<HTMLAnchorElement, StyledAnchorProps>(
  function StyledAnchor({ className, variant, size, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cn(variants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

export const Link = createLink(StyledAnchor);

export type LinkProps = LinkComponentProps<typeof StyledAnchor>;
