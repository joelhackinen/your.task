"use client";

import React, { use, useState, } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";

import { Container } from "./container";
import type { getBoardData } from "@/_data/board";

export function Board({
  boardDataPromise,
}: {
  boardDataPromise: ReturnType<typeof getBoardData>,
}) {
  const boardData = use(boardDataPromise);
  const [items, setItems] = useState(boardData.cards);
  const [, setActive] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 }} ),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActive(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainerOf(activeId);
    const overContainer = findContainerOf(overId);
    console.log(activeContainer);
    console.log(overContainer);


    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    const activeIndex = activeContainer.tasks.indexOf(activeContainer.tasks.find(t => t.id === activeId)!);
    const overIndex = overContainer.tasks.indexOf(overContainer.tasks.find(t => t.id === overId)!);

    if (activeIndex === overIndex) return;

    setItems((prev) => prev);
  };

  const findContainerOf = (id: UniqueIdentifier) => {
    for (const container of items) {
      if (container.tasks.some(p => p.id === id)) return container;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex">
        {items.map((container) => (
          <Container key={container.id} id={container.id} items={container.tasks.map(t => t.id)} />
        ))}
      </div>
    </DndContext>
  );
}