import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { z } from "zod";
import type { ActionState } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function defineAction<T extends z.ZodType>(
  schema: T,
  action: (
    prevState: ActionState<T>,
    validatedData: z.infer<T>,
  ) => Promise<ActionState<T>>
): (p: ActionState<T>, formData: FormData) => Promise<ActionState<T>> {
  return async (prevState: ActionState<T>, formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries());
    const validationResult = schema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        data: rawData as z.infer<T>,
        fieldErrors: validationResult.error.flatten().fieldErrors,
        success: false,
      };
    }

    return action(prevState, validationResult.data);
  };
}