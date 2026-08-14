"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The single CTA treatment for the whole site. Before this pass the hero,
 * about page, FAQ, homepage CTA and yacht detail each hand-rolled their own
 * anchor with a different radius (sm, lg, xl), a different height and a
 * different hover. Everything routes through here now.
 */
const buttonVariants = cva(
  [
    "sheen-parent inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-body font-semibold uppercase tracking-[0.12em]",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[#0A0A0B] shadow-lg shadow-black/30 hover:bg-primary-light hover:shadow-xl hover:shadow-white/10",
        outline:
          "border border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10",
        ghost:
          "bg-transparent text-white hover:bg-white/5",
        link:
          "rounded-none bg-transparent px-0 text-primary-light normal-case tracking-normal underline-offset-4 hover:translate-y-0 hover:text-white hover:underline",
      },
      size: {
        sm: "h-9 px-5 text-[11px]",
        default: "h-11 px-7 text-xs sm:text-sm",
        lg: "h-13 px-9 text-sm",
        icon: "h-10 w-10 px-0",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
