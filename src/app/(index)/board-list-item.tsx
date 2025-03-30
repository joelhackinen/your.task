"use client";

import type { SelectUsersBoards } from "@/_lib/db/schema/users-boards";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const BoardListItem = ({
  board: {
    boardId,
    boardName,
  },
}: {
  board: SelectUsersBoards
}) => {
  const [showCopied, setShowCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(boardId);
    setShowCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowCopied(false);
    }, 3000);
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
          <span>...</span>
          <span className="font-[family-name:var(--font-geist-mono)]">
            {boardId.slice(-4)}
          </span>
        </div>
        <Button size="icon" variant="ghost" className="size-6" onClick={handleCopy} disabled={showCopied} >
          {showCopied ? <Check size={14} /> : <Copy size={14} />}
        </Button>
      </div>
    </li>
  );
};