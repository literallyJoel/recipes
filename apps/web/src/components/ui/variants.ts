import { cva } from "class-variance-authority";

const variants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/92",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/92 focus-visible:ring-destructive/30",
        outline:
          "border-border bg-card text-card-foreground shadow-xs hover:bg-secondary hover:text-secondary-foreground",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/85",
        ghost: "text-foreground hover:bg-secondary/70 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:text-primary/85 hover:underline",
        retro:
          "rounded-full border-retro border-foreground bg-background text-foreground shadow-retro-sm hover:translate-x-nudge hover:translate-y-nudge hover:shadow-none",
        poster:
          "rounded-poster border-retro border-foreground bg-accent text-accent-foreground shadow-retro-sm hover:translate-x-nudge hover:translate-y-nudge hover:shadow-none",
        posterSecondary:
          "rounded-poster border-retro border-foreground bg-secondary text-secondary-foreground shadow-retro-sm hover:translate-x-nudge hover:translate-y-nudge hover:shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-11 rounded-md px-6",
        xl: "h-14 px-5 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export default variants;
