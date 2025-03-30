import { Suspense } from "react";
import { Board } from "./board";
import { getUser } from "@/_data/user";
import { redirect } from "next/navigation";
import { getBoardData } from "@/_data/board";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>,
}) {
  const boardId = (await params).boardId;
  const boardPromise = getBoardData(boardId);

  const user = await getUser();
  if (!user) redirect("/join");

  return (
    <div className="min-h-dvh">
      <Suspense fallback={<BoardSkeleton />}>
        <Board boardDataPromise={boardPromise} />
      </Suspense>
    </div>
  );
}


function BoardSkeleton() {
  console.log("kasdklsadhjklas")
  return (
    <div>MOOROROR</div>
  );
}