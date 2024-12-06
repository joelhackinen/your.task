import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tasks = [
  { id: 1, title: "Design user interface", status: "To Do", assignee: "Alice" },
  { id: 2, title: "Implement login functionality", status: "In Progress", assignee: "Bob" },
  { id: 3, title: "Write API documentation", status: "Done", assignee: "Charlie" },
  { id: 4, title: "Set up CI/CD pipeline", status: "To Do", assignee: "David" },
  { id: 5, title: "Refactor database schema", status: "In Progress", assignee: "Eve" },
  { id: 6, title: "Create user onboarding flow", status: "To Do", assignee: "Frank" },
  { id: 7, title: "Optimize database queries", status: "In Progress", assignee: "Grace" },
  { id: 8, title: "Implement error logging", status: "Done", assignee: "Henry" },
];

const BoardPage = () => {
  return (
    <main>
      <Card className="flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Name of the board</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 h-full">
            {['To Do', 'In Progress', 'Done'].map((status) => (
              <div key={status} className="bg-gray-100 p-4 rounded-lg flex flex-col overflow-hidden border shadow-sm">
                <h3 className="font-semibold mb-2">{status}</h3>
                <div className="flex-1 overflow-y-auto">
                  {tasks.filter(task => task.status === status).map((task) => (
                    <Card key={task.id} className="mb-2 p-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.assignee}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default BoardPage;