import { cn } from "@/_lib/utils";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  text: string;
  pendingText: string;
}

export function SubmitButton({
  text,
  pendingText,
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn("grid [grid-template-areas:'stack']", className)}
      type="submit"
      {...props}
    >
      <span className={cn("[grid-area:stack]", pending && "invisible")}>
        {text}
      </span>
      <span className={cn("[grid-area:stack]", !pending && "invisible")}>
        {pendingText}
      </span>
    </Button>
  );
}