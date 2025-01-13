"use client";

import { Button } from "@/components/ui/button";
import type { SelectUsersBoards } from "@/_lib/db/schema";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import Link from "next/link";

export const BoardListItem = ({
  board: {
    boardId,
    boardName,
  },
}: {
  board: SelectUsersBoards
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(boardId);
    toast({
      description: (
        <div>
          Identifier for <span className="italic">{boardName}</span> copied!
        </div>
      )
    });
  };
  return (
    <li key={boardId} className="flex gap-x-2 items-center">
      <Link
        href={`/board/${boardId}`}
        className="hover:underline"
      >
        {boardName}
      </Link>
      <div className="italic text-gray-500 flex items-center text-sm gap-x-1">
        <div>
          ...
          <span className="font-[family-name:var(--font-geist-mono)]">
            {boardId.slice(-4)}
          </span>
        </div>
        <Button size="icon" variant="ghost" className="size-6" onClick={handleCopy}>
          <Copy size={14} />
        </Button>
      </div>
    </li>
  );
};