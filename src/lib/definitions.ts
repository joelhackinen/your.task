import { z } from "zod";

export const CreateBoardFormSchema = z.object({
  name: z.string().min(1, "You must enter a name"),
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