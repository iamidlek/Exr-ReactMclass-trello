import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

// ITodo 모양을한 array
interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
