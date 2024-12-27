import { type CardType, type TaskType } from "@/db/schema";
import { Suspense, use } from "react";
import { Task } from "./task";
import { getTasks } from "@/_data/board";

export const Tasks = ({
  card,
}: {
  card: CardType,
}) => {
  const tasksPromise = getTasks(card.id);
  return (
    <Suspense fallback={(<div>Getting tasks...</div>)}>
      <TaskList tasksPromise={tasksPromise} />
    </Suspense>
  );
};

const TaskList = ({
  tasksPromise
}: {
  tasksPromise: Promise<TaskType[]>,
}) => {
  const tasks = use(tasksPromise);
  return (
    <ul>
      {tasks.map((t) => (
        <Task key={t.id} task={t} />
      ))}
    </ul>
  );
};
