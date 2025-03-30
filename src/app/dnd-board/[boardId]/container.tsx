"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const containerStyle = {
  background: "#dadada",
  padding: 10,
  margin: 10,
  flex: 1
};

export function Container({
  id,
  items
}: {
  id: string,
  items: string[]
}) {
  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={containerStyle}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </div>
    </SortableContext>
  );
}

export function Item({
  id
}: {
  id: string
}) {
  const style = {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white"
  };

  return <div style={style}>{id}</div>;
}

export function SortableItem({
  id
}: {
  id: string,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={id} />
    </div>
  );
}
