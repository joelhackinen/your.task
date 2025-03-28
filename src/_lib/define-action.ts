import type { z } from "zod";

type ActionStateSuccess<T extends z.AnyZodObject> = {
  success: true;
  inputs: z.infer<T>;
};

type ActionStateError<T extends z.AnyZodObject> = {
  success: false;
  inputs: z.infer<T>;
  fieldErrors?: {
    [K in keyof z.infer<T>]?: string[];
  };
  formError?: string;
  message?: string;
};

type ActionState<T extends z.AnyZodObject> =
  | ActionStateError<T>
  | ActionStateSuccess<T>
  | undefined;

export function defineAction<T extends z.AnyZodObject>(
  schema: T,
  action: (
    prevState: ActionState<T>,
    validatedData: z.infer<T>,
    success: typeof successActionFn<T>,
    error: typeof errorActionFn<T>,
  ) => Promise<ReturnType<typeof errorActionFn<T> | typeof successActionFn<T>>>
): (p: ActionState<T>, formData: FormData) => Promise<ActionState<T>> {
  return async (prevState: ActionState<T>, formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries());
    const validationResult = schema.safeParse(rawData);

    if (!validationResult.success) {
      const keys = Object.keys(schema.shape);
      const filledSchema: Record<string, string> = {};

      keys.forEach((k) => {
        filledSchema[k] = (rawData[k] || "") as string;
      });
      return errorFn({
        inputs: filledSchema as z.infer<T>,
        fieldErrors: validationResult.error.flatten().fieldErrors,
      });
    }

    const actionResult = await action(prevState, validationResult.data, successActionFn, errorActionFn);
    if (actionResult.success) {
      return successFn(actionResult.inputs ?? validationResult.data);
    }
    
    return errorFn({ 
      inputs: actionResult.inputs ?? validationResult.data,
      fieldErrors: actionResult.fieldErrors,
      formError: actionResult.formError,
      message: actionResult.message
    });
  };
}

type ActionStateSuccessWithoutInputs<T extends z.AnyZodObject> = {
  inputs?: Pick<ActionStateSuccess<T>, "inputs">["inputs"],
} & Omit<ActionStateSuccess<T>, "inputs">;

function successActionFn<T extends z.AnyZodObject>(inputs?: z.infer<T>): ActionStateSuccessWithoutInputs<T> {
  return {
    success: true,
    inputs,
  };
}

function successFn<T extends z.AnyZodObject>(inputs: z.infer<T>): ActionStateSuccess<T> {
  return {
    success: true,
    inputs,
  };
}

type ActionStateErrorWithoutInputs<T extends z.AnyZodObject> = {
  inputs?: Pick<ActionStateError<T>, "inputs">["inputs"],
} & Omit<ActionStateError<T>, "inputs">;

type ActionErrorFnParams<T extends z.AnyZodObject> = {
  inputs?: Pick<ActionStateError<T>, "inputs">["inputs"];
} & Omit<ActionStateError<T>, "success" | "inputs">;

type ErrorFnParams<T extends z.AnyZodObject> = {
  inputs: Pick<ActionStateError<T>, "inputs">["inputs"];
} & Omit<ActionStateError<T>, "success" | "inputs">;

function errorActionFn<T extends z.AnyZodObject>({ inputs, fieldErrors, formError, message }: ActionErrorFnParams<T>): ActionStateErrorWithoutInputs<T> {
  return {
    success: false,
    inputs,
    fieldErrors,
    formError,
    message,
  };
}

function errorFn<T extends z.AnyZodObject>({ inputs, fieldErrors, formError, message }: ErrorFnParams<T>): ActionStateError<T> {
  return {
    success: false,
    inputs,
    fieldErrors,
    formError,
    message,
  };
}