import * as React from "react";

import { Cards } from "./cards";
import { getBoard, getUser, } from "@/_data/user";
import { redirect } from "next/navigation";
import { getCards } from "@/_data/board";


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
  const cardsPromise = getCards(board.boardId);

  return (
    <div className="h-dvh space-y-2">
      <h1>{board.boardName}</h1>
      <React.Suspense fallback={(<div>Loading cards...</div>)}>
        <Cards cardsPromise={cardsPromise} />
      </React.Suspense>
    </div>
  );
};
