"use server";

import { getBoardByCardId, getUser, hasAccessToBoard } from "@/_data/user";
import { AddTaskFormSchema } from "@/_lib/definitions";
import { db } from "@/_lib/db"; 
import { cards, tasks } from "@/_lib/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { defineAction } from "@/_lib/define-action";

export const addTask = defineAction(AddTaskFormSchema, async (_prev, validatedData) => {
  const { cardId, title, description } = validatedData;
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const board = await getBoardByCardId(cardId);
  if (!board) redirect("/");

  const hasAccess = await hasAccessToBoard(user.id, board.id);
  if (!hasAccess) redirect("/");

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
    success: true,
    inputs: {
      title: "",
      description: "",
      cardId: cardId,
      keepAdding: keepAdding,
    },
    message: "Task " + title + " added successfully!"
  };
});

export const addTaskAction = async (_: AddTaskActionState, formData: FormData) => {  
  
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

export const editCardTitleAction = async (cardId: string, newTitle: string) => {
  const user = await getUser();
  if (!user) redirect("/join");

  const board = await getBoardByCardId(cardId);
  if (!board) redirect("/join");

  const hasAccess = await hasAccessToBoard(user.id, board.id);
  if (!hasAccess) redirect("/join");

  await db.update(cards).set({ title: newTitle ?? "Untitled" }).where(eq(cards.id, cardId));

  revalidatePath(`/board/${board.id}`);
};

export const createCardAction = async (boardId: string) => {
  await db.insert(cards).values({ title: "New card", boardId });
  revalidatePath(`/board/${boardId}`);
};