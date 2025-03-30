import { Suspense } from "react";
import { Task } from "./task";
import { getTasks } from "@/_data/board";
import type { SelectCard } from "@/_lib/db/schema/cards";
import type { SelectTask } from "@/_lib/db/schema/tasks";

export const Tasks = async ({
  card,
}: {
  card: SelectCard,
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
  tasks: SelectTask[],
}) => (
    <ul>
      {tasks.map((t) => (
        <Task key={t.id} task={t} />
      ))}
    </ul>
  );
