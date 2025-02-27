"use server";

import { getBoardByCardId, getUser, hasAccessToBoard } from "@/_data/user";
import { AddTaskFormSchema } from "@/_lib/definitions";
import { db } from "@/_lib/db"; 
import { cards, tasks } from "@/_lib/db/schema";
import type { AddTaskActionState } from "./add-task-form";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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
  revalidatePath(`/board/${board.id}`);

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

export const deleteTaskAction = async (taskId: string, cardId: string) => {
  const user = await getUser();
  if (!user) redirect("/join");

  const board = await getBoardByCardId(cardId);
  if (!board) redirect("/");

  const hasAccess = await hasAccessToBoard(user.id, board.id);
  if (!hasAccess) redirect("/");

  console.log("deleting", taskId, "from tasks");
  await db.delete(tasks).where(eq(tasks.id, taskId));

  revalidatePath(`/board/${board.id}`);
};

export const moveCardAction = async (from: string, to: string, taskId: string) => {
  const user = await getUser();
  if (!user) redirect("/join");

  const board = await getBoardByCardId(from);
  if (!board) redirect("/join");

  const hasAccess = await hasAccessToBoard(user.id, board.id);
  if (!hasAccess) redirect("/join");

  const [deletedTask] = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();

  if (!deletedTask) return;

  await db.insert(tasks).values({ ...deletedTask, cardId: to });

  revalidatePath(`/board/${board.id}`);
};

export const createCardAction = async (boardId: string) => {
  "use server";

  await db.insert(cards).values({ title: "New card", boardId });
  revalidatePath(`/board/${boardId}`);
};