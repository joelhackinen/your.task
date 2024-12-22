import { Suspense, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBoardDrawer } from "@/app/(index)/create-board-drawer";
import { JoinBoardDrawer } from "@/app/(index)/join-board-drawer";
import { getBoards, getUser } from "@/_data/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutComponent } from "@/components/ui/signout-button";
import { deleteSession } from "@/_lib/session";
import { sleep } from "@/_lib/utils";


export default () => {
  const userPromise = getUser();

  return (
    <div className="container mx-auto space-y-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome to your.task</CardTitle>
          <CardDescription>Easy all-purpose task board</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 items-center">
            <Suspense>
              <Buttons userPromise={userPromise} />
            </Suspense>
          </div>
          <Suspense fallback={(<div>Who are you...</div>)}>
            <UserInfo userPromise={userPromise} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

const Buttons = ({
  userPromise,
}: {
  userPromise: Promise<{ id: string, username: string } | undefined>
}) => {
  const user = use(userPromise);

  if (!user) {
    return (
      <Button asChild>
        <Link href="/join">Join now!</Link>
      </Button>
    );
  }
  return (
    <>
      <CreateBoardDrawer />
      <JoinBoardDrawer />
    </>
  );
};

const signOutAction = async () => {
  "use server"
  await sleep(1000);
  await deleteSession();
};

const UserInfo = ({
  userPromise,
}: {
  userPromise: Promise<{ id: string, username: string } | undefined>,
}) => {
  const user = use(userPromise);

  if (!user) return null;

  const boardsPromise = getBoards(user.id);

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <h3 className="text-lg font-semibold">Your boards</h3>
        <span className="italic">Logged in as {user.username}</span>
        <SignOutComponent signOutAction={signOutAction} />
      </div>
      <BoardList boardsPromise={boardsPromise} />
    </div>
  );
};

const BoardList = ({
  boardsPromise,
}: {
  boardsPromise: Promise<{ boardId: string, boardName: string }[]>,
}) => {
  const boards = use(boardsPromise);

  if (boards.length === 0) {
    return (
      <div>
        No boards
      </div>
    );
  }
  return (
    <ul>
      {boards.map((b) => (
        <li key={b.boardId}>
          <Link
            href={`/${b.boardId}`}
            className="hover:underline"
          >
            {b.boardName}
          </Link>
        </li>
      ))}
    </ul>
  );
};