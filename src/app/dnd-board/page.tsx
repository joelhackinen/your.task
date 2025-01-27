"use client";

import React, { useState, } from "react";
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

export default function Page() {
  const [items, setItems] = useState([
    { id: "c1", items: ["1", "2", "3"] },
    { id: "c2", items: ["4", "5", "6"] },
    { id: "c3", items: ["7", "8"] },
  ]);
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

    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    const activeIndex = activeContainer.items.indexOf(activeId as string);
    const overIndex = overContainer.items.indexOf(overId as string);

    if (activeIndex === overIndex) return;

    setItems((prev) => prev);
  };

  const findContainerOf = (id: UniqueIdentifier) => {
    for (const container of items) {
      if (container.items.includes(id as string)) return container;
    }
    return null;
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex">
          {items.map((container) => (
            <Container key={container.id} id={container.id} items={container.items} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}