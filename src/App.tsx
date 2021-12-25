import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, IToDoState } from "./atoms";
import Board from "./Components/Board";
import { Droppable } from "react-beautiful-dnd";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
`;

const AddBoard = styled.form`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 250px;
`;

const Input = styled.input`
  font-size: 16px;
  border: 0;
  background-color: white;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin: 0 auto;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const addBoard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(event.currentTarget.boardName.value);
    const input = event.currentTarget.boardName;
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [input.value]: [],
      };
    });
    input.value = "";
    input.blur();
  };

  const onDragEnd = (info: DropResult) => {
    // console.log(info);
    const { destination, source, type, draggableId } = info;
    // destination이 undefined일 경우 kill function
    if (!destination) return;
    // 보드 순서 변경
    if (type === "board") {
      if (destination.index === source.index) return;
      setToDos((allBoards) => {
        const keys = Object.keys(allBoards);
        keys.splice(source.index, 1);
        keys.splice(destination.index, 0, draggableId);

        const newBoardList: IToDoState = {};
        keys.forEach((key) => {
          newBoardList[key] = allBoards[key];
        });
        return newBoardList;
      });
      // 위의 return은 setToDos의 retrun
      // 아래의 return은 if 문에 대한 전체 함수 종료명령
      return;
    }
    // same board movement.
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        // 변경하는 board만 복사
        const boardCopy = [...allBoards[source.droppableId]];
        // 특정 오브젝트를 잡아서 옮김
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          // 해당 보드만 갱신
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        // 기존 보드와 이동할 보드를 복사
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        const taskObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <>
      <AddBoard onSubmit={addBoard}>
        <Input id="boardName" placeholder="Add New Board (Press Enter)" />
      </AddBoard>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boardList" type="board" direction="horizontal">
          {(magic) => (
            <Wrapper>
              <Boards ref={magic.innerRef}>
                {Object.keys(toDos).map((boardId, idx) => (
                  <Board
                    boardId={boardId}
                    key={boardId}
                    toDos={toDos[boardId]}
                    idx={idx}
                  />
                ))}
              </Boards>
              {magic.placeholder}
            </Wrapper>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
export default App;
