import { relations } from "drizzle-orm";
import boards from "./boards";
import cards from "./cards";
import tasks from "./tasks";
import usersBoards from "./users-boards";
import users from "./users";

const boardsRelations = relations(boards, ({ many }) => ({
  cards: many(cards),
  userBoard: many(usersBoards),
}));

const cardsRelations = relations(cards, ({ one, many }) => ({
  board: one(boards, {
    fields: [cards.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));

const tasksRelations = relations(tasks, ({ one }) => ({
  card: one(cards, {
    fields: [tasks.cardId],
    references: [cards.id],
  }),
}));

const usersToBoardsRelations = relations(usersBoards, ({ one }) => ({
  board: one(boards, {
    fields: [usersBoards.boardId],
    references: [boards.id],
  }),
  user: one(users, {
    fields: [usersBoards.userId],
    references: [users.id],
  }),
}));

const usersRelations = relations(users, ({ many }) => ({
  usersBoards: many(usersBoards),
}));

const relationsObj = {
  boardsRelations,
  cardsRelations,
  tasksRelations,
  usersToBoardsRelations,
  usersRelations,
};

export default relationsObj;