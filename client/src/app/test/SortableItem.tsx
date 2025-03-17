import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";

interface Card {
  card_id: number;
  content: string;
}

interface SortableItemProps {
  id: string;
  item: Card;
  columnId: string;
}

const SortableItem: FC<SortableItemProps> = ({ id, item, columnId }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`card ${isDragging ? "dragging" : ""}`}
      style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px" }}
    >
      <p>{item.content}</p>
      <p>Column: {columnId}</p>
    </div>
  );
};

export default SortableItem;
