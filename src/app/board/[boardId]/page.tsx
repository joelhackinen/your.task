import { Cards } from "./cards";
import { getUser, getUsersBoards } from "@/_data/user";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getBoardData } from "@/_data/board";


const BoardPage = ({
  params,
}: {
  params: Promise<{ boardId: string }>,
}) => {
  getUser();
  return (
    <div className="h-dvh flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Link href="/" aria-label="Home link">
          <ArrowLeft />
        </Link>
        <Suspense fallback={(<h1 className="text-2xl font-bold">Loading...</h1>)}>
          <BoardName params={params} />
        </Suspense>
      </div>
      <Suspense fallback={(<div>Loading cards...</div>)}>
        <Cards className="flex-1" params={params} />
      </Suspense>
    </div>
  );
};

export default BoardPage;


const BoardName = async ({
  params,
}: {
  params: Promise<{ boardId: string }>,
}) => {
  const boardId = (await params).boardId;
  await getBoardData(boardId);
  const user = await getUser();
  if (!user) redirect("/join");
  const board = (await getUsersBoards(user.id)).find(b => b.boardId === boardId);
  if (!board) redirect("/");

  return (
    <h1 className="text-2xl font-bold">{board.boardName}</h1>
  );
};