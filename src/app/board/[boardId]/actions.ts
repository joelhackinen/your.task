"use server";

import { getBoardByCardId, getUser, hasAccessToBoard } from "@/_data/user";
import { AddTaskFormSchema } from "@/_lib/definitions";
import { db } from "@/db"; 
import { tasks } from "@/db/schema";
import type { AddTaskActionState } from "./add-task-form";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const addTaskAction = async (_: AddTaskActionState, formData: FormData) => {  
  const taskData = {
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    cardId: formData.get("cardId") ?? "",
    keepAdding: formData.get("keep-adding"),
  };

  const user = await getUser();
  
  if (!user) {
    return {
      data: taskData,
      message: "You need to be logged in!"
    };
  }

  // check if user is member of the board
  const board = await getBoardByCardId(taskData.cardId as string);
  if (!board) redirect("/");

  const hasAccess = await hasAccessToBoard(user.id, board.id);
  if (!hasAccess) redirect("/");

  // validate input
  const validationResult = AddTaskFormSchema.safeParse(taskData);
  if (!validationResult.success) {
    return {
      data: taskData,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { cardId, title, description } = validationResult.data;

  // add task to the card
  await db.insert(tasks).values({
    cardId,
    title,
    description,
  });

  // revalidate the path
  revalidatePath(`/${board.id}`);

  // reset title and description
  return {
    data: {
      title: "",
      description: "",
      cardId: taskData.cardId,
      keepAdding: taskData.keepAdding,
    },
    message: "Task " + title + " added successfully!"
  };
};