"use server"

import { getUser } from "@/_data/user";
import { AddTaskFormSchema } from "@/_lib/definitions";
import { sleep } from "@/_lib/utils";
import { db } from "@/db"; 
import { boards, cards, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AddTaskActionState } from "./add-task-form";

export const addTask = async (_: AddTaskActionState, formData: FormData) => {
  await sleep(2000);
  
  const taskData = {
    name: formData.get("name") ?? "",
    password: formData.get("password") ?? "",
  };

  const user = await getUser();
  
  if (!user) {
    return {
      data: taskData,
      message: "You need to be logged in!"
    };
  }

  


  const validationResult = AddTaskFormSchema.safeParse(taskData);


};