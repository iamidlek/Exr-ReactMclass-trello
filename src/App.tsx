import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  /* align-items: flex-start; */
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
    const { destination, source } = info;
    // destination이 undefined일 경우 kill function
    if (!destination) return;
    // same board movement.
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        // 변경하는 board만 복사
        const boardCopy = [...allBoards[source.droppableId]];
        // 특정 오브젝트를 잡아서 옮김
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
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
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}
export default App;
