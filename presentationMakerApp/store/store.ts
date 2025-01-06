import { EditorType } from "../../source/presentationMaker";
import { editor } from '../store/data.ts'
import { legacy_createStore as createStore, applyMiddleware, UnknownAction } from "redux";
import { rootReducer } from './reducers/rootReducer';
import { thunk, ThunkAction } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import * as tools from '../../source/presentationMaker.ts'
import { validateEditorState } from "./functions/importEditor.ts";
export const LOCAL_STORAGE_KEY = 'editorState';
export interface UndoableState {
  past: tools.EditorType[];
  present: tools.EditorType;
  future: tools.EditorType[];
  isChanging: boolean;
}

export function saveEditorStateToLocalStorage(editorState: EditorType): void {
  if (validateEditorState(editorState)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editorState));
  } else {
    localStorage.clear()
  }
}

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log("Dispatching action:", action);
  const result = next(action);
  console.log("Next state:", store.getState());
  return result;
};
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  UndoableState,
  unknown,
  UnknownAction
>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export function loadEditorStateFromLocalStorage(): EditorType | null {

  const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  let editorState = editor;
  if (storedState) {
    try {
      editorState = JSON.parse(storedState);
    } catch (e) {

      console.log(e)
    }
    if (validateEditorState(editorState)) {
      return editorState
    } else { editorState = editor }
  }
  return editorState;
}
const preloadedState: UndoableState = { past: [], present: loadEditorStateFromLocalStorage() || editor, future: [], isChanging: false };
export const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk, loggerMiddleware));

type RootState = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
