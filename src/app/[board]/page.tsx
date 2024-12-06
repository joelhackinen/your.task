import * as React from "react";

import { Cards } from "./cards";
import { getBoardAction, getCardsAction } from "./actions";


const BoardPage = async ({
  params,
}: {
  params: Promise<{ board: string}>,
}) => {
  const boardId = (await params).board;
  console.log(boardId)
  const board = await getBoardAction(Number(boardId));
  const cards = getCardsAction(Number(boardId));

  return (
    <main className="h-dvh">
      <h1>{board?.name}</h1>
      <React.Suspense fallback={(<div>Loading cards...</div>)}>
        <Cards cardsPromise={cards} />
      </React.Suspense>
    </main>
  );
};

export default BoardPage;