"use client";

import "./test.css";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SortableItem from "./SortableItem";

// Définir les types des colonnes et des cartes
interface Card {
  card_id: number;
  content: string;
}

interface Column {
  name: string;
  statusId: number;
  items: Card[];
}

interface Columns {
  [key: string]: Column;
}

const initialColumns: Columns = {
  column1: {
    name: "À faire",
    statusId: 1,
    items: [
      { card_id: 1, content: "Tâche 1" },
      { card_id: 2, content: "Tâche 2" },
    ],
  },
  column2: {
    name: "En cours",
    statusId: 2,
    items: [
      { card_id: 3, content: "Tâche 3" },
    ],
  },
  column3: {
    name: "Terminé",
    statusId: 3,
    items: [],
  },
};

const Board = () => {
  const [columns, setColumns] = useState(initialColumns);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const sourceColumnId = active.data.current?.columnId;
    const destinationColumnId = over.id;

    if (!sourceColumnId || sourceColumnId === destinationColumnId) return;

    // Récupérer les colonnes source et destination
    const sourceColumn = columns[sourceColumnId];
    const destinationColumn = columns[destinationColumnId];

    if (!sourceColumn || !destinationColumn) return;

    const sourceItems = [...sourceColumn.items];
    const destinationItems = [...destinationColumn.items];

    const movedItemIndex = sourceItems.findIndex(
      (item) => item.card_id.toString() === active.id.toString()
    );
    if (movedItemIndex === -1) return;

    const [movedItem] = sourceItems.splice(movedItemIndex, 1);
    destinationItems.push(movedItem);

    setColumns({
      ...columns,
      [sourceColumnId]: { ...sourceColumn, items: sourceItems },
      [destinationColumnId]: { ...destinationColumn, items: destinationItems },
    });
  };

  return (
    <DndContext>
      <SortableContext items={["A, "B", "C"]}>
        <DndContext>
          <SortableContext items={["A, "B", "C"]}>
            {/* ... */}
          </SortableContext>
        </DndContext>
      </SortableContext>
    </DndContext>
  );
};

export default Board;
