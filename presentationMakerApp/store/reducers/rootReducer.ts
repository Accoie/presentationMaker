import { UnknownAction } from "redux";
import { editorPresentationReducer } from "./editorPresentationReducer";
import { editorReducer } from "./editorReducer";
import { editorSlidesReducer } from "./editorSlidesReducer";
import { editorSlideElementsReducer } from "./editorSlideElementsReducer";

import { LOCAL_STORAGE_KEY, UndoableState } from "../store";
import * as tools from '../../../source/presentationMaker'
import { editor } from "../data";
function saveEditorStateToLocalStorage(editorState: tools.EditorType): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editorState));
}

export const rootReducer = (state: UndoableState = {past: [], present: editor, future: [], isChanging: false}, action: UnknownAction): UndoableState => {
  let newState = {...state};
  newState.present = editorPresentationReducer(newState.present, action);
  newState.present = editorSlidesReducer(newState.present, action);
  newState.present = editorSlideElementsReducer(newState.present, action);
  newState = editorReducer(newState, action);
  if (
    state.isChanging !== action.payload &&
    state.isChanging === false &&      // Это не `UNDO` или `REDO`
    action.type !== 'UNDO_EDITOR' &&      // Не сбрасывать `future` для `UNDO`
    action.type !== 'REDO_EDITOR' &&
    action.type !== 'SET_SELECTION'        // Не сбрасывать `future` для `REDO`
  ) {
    newState.past = [...newState.past, state.present];
    newState.future = [];
  }
  saveEditorStateToLocalStorage(newState.present);
  return newState;
};
