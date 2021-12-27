# Drag and Drop

## Challenge

- [x] Own styling
- [x] user can create New Board
- [x] Changeable order(Boards)
- [x] Removable(Board, Card)
- [x] Use localStorage

## react-beautiful-dnd

### DragDropContext

```js
<DragDropContext onDragEnd={onDragEnd}>
```

- dnd가 필요한 곳에 영역을 만든다.

```js
const onDragEnd = (info: DropResult) => {
  // console.log(info);
  const { destination, source, type, draggableId } = info;
  // 변화에 대한 로직 처리
};
```

- 드롭 후 실행되는 함수에는 이동과 관련된 정보들이 들어온다.

### Droppable

```js
<Droppable droppableId="boardList" type="board" direction="horizontal">
  {(provide)) => (
    <Wrapper>
      <Boards ref={provide.innerRef}>
        // 드래그 가능한 item들
      </Boards>
      {provide.placeholder}
    </Wrapper>
  )}
```

- 드래그한 아이템을 드롭 할 수 있는 영역을 만든다.
- 영역에 해당하는 태그에 ref로 provide.innerRef를 준다.
- 드롭 영역 간의 구분 방법
  - source.droppableid , destination.droppableId
  - type을 지정 함으로 구분도 가능하다

### Draggable

```js
<Draggable draggableId={toDoId + ""} index={index}>
  {(magic, snapshot) => (
    <Card
      isDragging={snapshot.isDragging}
      ref={magic.innerRef}
      {...magic.dragHandleProps}
      {...magic.draggableProps}
    >
      {toDoText}
    </Card>
  )}
```

- draggableProps로 draggableId를 알 수 있다.
- dragHandleProps로 드래그 가능하게 할 수 있다. (함수가 들어 있음)
- 움직이거나 변화를 줄 요소에 ref={magic.innerRef}를 지정한다.
- Droppablestate snapshot을 통해 상태에 따른 효과 지정 가능

```text
isDraggingOver: boolean
Droppable영역에 `드래그 되는 아이템`이 있는지 여부

draggingOverWith: DraggableId
Droppable영역에 `드래그 되는 아이템`의 ID

draggingFromThisWith: DraggableId
Droppable영역을 벗어난 `드래그 되는 아이템`의 ID

isUsingPlaceholder: boolean
placeholder가 사용되고 있는지 여부
```
