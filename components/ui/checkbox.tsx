"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

// Define a new interface that extends CheckboxPrimitive's props
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  borderColor?: string; // Adding borderColor as an optional prop
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps // Use the newly defined CheckboxProps type
>(({ className, borderColor, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `peer phone:size-4 lg:size-[18px] shrink-0 rounded-[5px] card-cover shadow focus-visible:outline-none border ${borderColor} disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-500 data-[state=checked]:via-blue-600 data-[state=checked]:to-blue-700 data-[state=checked]:text-neutral-50 data-[state=checked]:border-0`,
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-[14px] w-[14px]" strokeWidth={2} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };