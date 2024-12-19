import * as React from "react";

import { Cards } from "./cards";
import { getBoard, getUser, } from "@/_data/user";
import { redirect } from "next/navigation";


export default async ({
  params,
}: {
  params: Promise<{ board: string}>,
}) => {
  const user = await getUser();
  if (!user) return redirect("/join");
  const boardId = (await params).board;
  const board = await getBoard(user.id, boardId);
  if (!board) return redirect("/");

  return (
    <main className="h-dvh">
      <h1>{board.boardName}</h1>
      <React.Suspense fallback={(<div>Loading cards...</div>)}>
        <Cards cardsPromise={cards} />
      </React.Suspense>
    </main>
  );
};
