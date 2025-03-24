import { z } from "zod";

type ActionStateSuccess<T extends z.ZodTypeAny> = {
  data?: z.infer<T>;
  success: true;
  message?: string;
}

type ActionStateError<T extends z.ZodTypeAny> = {
  data?: z.infer<T>;
  fieldErrors?: {
    [K in keyof z.infer<T>]?: string[];
  };
  formError?: string;
  success: false;
  message?: string;
}

export type ActionState<T extends z.ZodTypeAny> = ActionStateError<T> | ActionStateSuccess<T> | undefined;

export const CreateBoardFormSchema = z.object({
  name: z.string().min(1, "You must enter a name"),
  password: z.string(),
});

export const JoinBoardFormSchema = z.object({
  id: z.string().uuid(),
  password: z.string(),
});

export const SignUpFormSchema = z.object({
  username: z.string().min(2, "Username must be at least two characters"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const LoginFormSchema = z.object({
  username: z.string().min(1, "Enter a username"),
  password: z.string().min(1, "Enter a password"),
});

export const AddTaskFormSchema = z.object({
  title: z.string().min(1, "Enter a title"),
  description: z.string(),
  cardId: z.string().uuid(),
});