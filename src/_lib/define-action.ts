import type { z } from "zod";

type ActionStateSuccess<T extends z.ZodTypeAny> = {
  success: true;
  inputs?: z.infer<T>;
  message?: string;
}

type ActionStateError<T extends z.ZodTypeAny> = {
  success: false;
  inputs?: {
    [K: string]: FormDataEntryValue;
  };
  fieldErrors?: {
    [K in keyof z.infer<T>]?: string[];
  };
  formError?: string;
  message?: string;
}

export type ActionState<T extends z.ZodTypeAny> = ActionStateError<T> | ActionStateSuccess<T> | undefined;

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
        success: false,
        inputs: rawData,
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    return action(prevState, validationResult.data);
  };
}
