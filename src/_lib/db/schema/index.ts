import boardsTable from "./boards";
import cardsTable from "./cards";
import usersTable from "./users";
import tasksTable from "./tasks";
import usersBoardsTable from "./users-boards";
import relations from "./relations";

export const boards = boardsTable;
export const cards = cardsTable;
export const users = usersTable;
export const tasks = tasksTable;
export const usersBoards = usersBoardsTable;

const schema = { boards, cards, users, tasks, usersBoards, ...relations, };
export default schema;