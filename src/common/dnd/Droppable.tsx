import { useDroppable } from "@dnd-kit/core";

type Props = {
  children?: React.ReactNode;
  id?: string;
};

function Droppable(props: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id || "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export default Droppable;
