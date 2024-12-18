import { UnknownAction } from "redux";
import { EditorType } from "../../../source/presentationMaker";
import { editorPresentationReducer } from "./editorPresentationReducer";
import { editorReducer } from "./editorReducer";
import { editorSlidesReducer } from "./editorSlidesReducer";
import { editorSlideElementsReducer } from "./editorSlideElementsReducer";
import { editor } from "../data";
import { LOCAL_STORAGE_KEY } from "../store";
function saveEditorStateToLocalStorage(editorState: EditorType): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editorState));
}

export const rootReducer = (state: EditorType = editor, action: UnknownAction): EditorType => {
  let newState = state;
  newState = editorPresentationReducer(newState, action);
  newState = editorReducer(newState, action);
  newState = editorSlidesReducer(newState, action);
  newState = editorSlideElementsReducer(newState, action);
  saveEditorStateToLocalStorage(newState);
  return newState;
};
