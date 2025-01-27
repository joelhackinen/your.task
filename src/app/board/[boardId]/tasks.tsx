import { type CardType, type TaskType } from "@/_lib/db/schema";
import { Suspense } from "react";
import { Task } from "./task";
import { getTasks } from "@/_data/board";

export const Tasks = async ({
  card,
}: {
  card: CardType,
}) => {
  const tasks = await getTasks(card.id);
  return (
    <Suspense fallback={(<div>Getting tasks...</div>)}>
      <TaskList tasks={tasks} />
    </Suspense>
  );
};

const TaskList = ({
  tasks
}: {
  tasks: TaskType[],
}) => (
    <ul>
      {tasks.map((t) => (
        <Task key={t.id} task={t} />
      ))}
    </ul>
  );
