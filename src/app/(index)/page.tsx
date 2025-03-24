import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBoardDrawer } from "@/app/(index)/create-board-drawer";
import { JoinBoardDrawer } from "@/app/(index)/join-board-drawer";
import { getUser, getUsersBoards } from "@/_data/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutComponent } from "@/components/signout";
import { deleteSession } from "@/_lib/session";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardListItem } from "./board-list-item";


const IndexPage = () => {
  getUser();
  return (
    <Card className="container mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Welcome to your.task</CardTitle>
        <CardDescription>Easy all-purpose task board</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense fallback={(
          <div className="flex flex-col gap-y-2 w-28 mx-auto">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}>
          <Buttons />
        </Suspense>
        <Suspense fallback={(<div>Who are you...</div>)}>
          <UserInfo />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default IndexPage;

const Buttons = async () => {
  const user = await getUser();

  if (!user) {
    return (
      <Button className="flex w-24 mx-auto" asChild>
        <Link href="/join">Join now!</Link>
      </Button>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 w-28 mx-auto">
      <CreateBoardDrawer />
      <JoinBoardDrawer />
    </div>
  );
};

const signOutAction = async () => {
  "use server";
  await deleteSession();
};

const UserInfo = async () => {
  const user = await getUser();

  if (!user) return null;

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <h3 className="text-lg font-semibold">Your boards</h3>
        <span className="italic">Logged in as {user.username}</span>
        <SignOutComponent signOutAction={signOutAction} />
      </div>
      <Suspense fallback="Loading boards...">
        <BoardList userId={user.id} />
      </Suspense>
    </div>
  );
};

const BoardList = async ({
  userId,
}: {
  userId: string,
}) => {
  const boards = await getUsersBoards(userId);

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
        <BoardListItem key={b.boardId} board={b} />
      ))}
    </ul>
  );
};