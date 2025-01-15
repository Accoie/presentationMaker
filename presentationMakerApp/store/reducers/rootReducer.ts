import { UnknownAction } from 'redux';
import { editorPresentationReducer } from './editorPresentationReducer';
import { editorReducer } from './editorReducer';
import { editorSlidesReducer } from './editorSlidesReducer';
import { editorSlideElementsReducer } from './editorSlideElementsReducer';
import {  UndoableState, saveEditorStateToLocalStorage } from '../store';
import { editor } from '../data';

export const rootReducer = (state: UndoableState = {past: [], present: editor, future: [], isChanging: false}, action: UnknownAction): UndoableState => {
  let newState = {...state};
  newState.present = editorPresentationReducer(newState.present, action);
  newState.present = editorSlidesReducer(newState.present, action);
  newState.present = editorSlideElementsReducer(newState.present, action);
  newState = editorReducer(newState, action);
  
  if (
    state.isChanging !== action.payload &&
    state.isChanging === false &&     
    action.type !== 'UNDO_EDITOR' &&    
    action.type !== 'REDO_EDITOR' &&
    action.type !== 'SET_SELECTION'        
  ) {
    
    newState.past = [...newState.past, state.present];
    newState.future = [];
    saveEditorStateToLocalStorage(newState.present);
  }
  
  return newState;
};
