import type { ComponentProps } from "react";

interface InputErrorsProps extends ComponentProps<"ul"> {
  errors?: string[]
}

export const InputErrors = ({ errors, ...props }: InputErrorsProps) => {
  if (!errors) return null;
  return (
    <ul {...props} >
      {errors.map((error) => (
        <li key={error} className="text-red-500 text-sm">
          {error}
        </li>
      ))}
    </ul>
  );
};