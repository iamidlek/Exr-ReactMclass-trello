import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  font-size: 18px;
  line-height: 14px;
  background-color: ${(props) =>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
  display: flex;
  justify-content: space-between;
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const removeItem = (id: string) => {
    setToDos((allBoards) => {
      const copyBoard = Object.assign({}, allBoards);
      const keys = Object.keys(allBoards);
      keys.forEach((key) => {
        copyBoard[key] = allBoards[key].filter((x) => x.id !== Number(id));
      });
      return copyBoard;
    });
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <FiX
            onClick={() =>
              removeItem(magic.draggableProps["data-rbd-draggable-id"])
            }
          />
        </Card>
      )}
    </Draggable>
  );
}

// 전체가 재렌더링 되어서 깜빡거리는 문제를 해결
export default React.memo(DragabbleCard);
