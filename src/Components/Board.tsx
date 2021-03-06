import React from "react";
import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { FiX } from "react-icons/fi";

const Icon = styled.div`
  user-select: none;
  font-size: 18px;
  line-height: 40px;
  position: absolute;
  right: 20px;
  display: none;
`;

const Wrapper = styled.div<{ isDragging: Boolean }>`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#718093" : props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  /* 자식요소에게 flex-grow를 주기 위함 */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
  &:hover ${Icon} {
    display: block;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

const Title = styled.h2`
  user-select: none;
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 40px;
  background-color: #3b3b98;
  color: #f8efba;
  width: 60%;
  height: 40px;
  border-radius: 5px;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  idx: number;
}

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    // 현재 선택한 Draggable이 특정 Droppable위에 드래깅 되고 있는지 여부 확인
    // 현재 Droppable에서 벗어난 드래깅되고 있는 Draggable ID
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
  width: 100%;
`;

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, idx }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  const removeBoard = (title: string) => {
    setToDos((allBoards) => {
      const copyBoard = Object.assign({}, allBoards);
      delete copyBoard[title];
      return copyBoard;
    });
  };
  return (
    <Draggable draggableId={boardId} index={idx}>
      {(provide, snapshot) => (
        <Wrapper
          ref={provide.innerRef}
          {...provide.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <Title {...provide.dragHandleProps}>{boardId}</Title>
          <Icon>
            <FiX
              onClick={() =>
                removeBoard(provide.draggableProps["data-rbd-draggable-id"])
              }
            />
          </Icon>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}`}
              autoComplete="off"
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(
              magic,
              info // info 는 snapshot 기능을 가지고 있다
              // https://github.com/atlassian/react-beautiful-dnd/blob/HEAD/docs/api/droppable.md#2-snapshot-droppablestatesnapshot
            ) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}
export default React.memo(Board);
