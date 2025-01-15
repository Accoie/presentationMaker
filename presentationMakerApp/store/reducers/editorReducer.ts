import { UnknownAction } from 'redux';
import { importEditor} from '../functions/importEditor';
import {exportEditor} from '../functions/exportEditor';
import { UndoableState } from '../store';

export const editorReducer = (state: UndoableState, action: UnknownAction): UndoableState => {
  switch (action.type) {
    case 'SET_IS_CHANGING': {
      return {past: state.past, present: state.present, future: state.future, isChanging: action.payload as boolean};
    }
    case 'IMPORT_EDITOR': {
        return {past: [...state.past, state.present], present: importEditor(state.present, action.payload as string), future: [], isChanging: false};
    }
    case 'EXPORT_EDITOR': {
        exportEditor(state.present);
        return state;
    }
    case 'UNDO_EDITOR': {
      if (state.past.length === 0) {
        return state; 
      }
      const previousState = state.past[state.past.length - 1];  
      const updatedPast = state.past.slice(0, -1);
      const updatedFuture = [state.present, ...state.future];  
      return {
        past: updatedPast,
        present: previousState,
        future: updatedFuture,
        isChanging: false
      };
    }
    case 'REDO_EDITOR': {
      if (state.future.length === 0) {
        return state; 
      }
      const nextState = state.future[0];  
      const updatedPast = [...state.past, state.present]; 
      const updatedFuture = state.future.slice(1);  
      return {
        past: updatedPast,
        present: nextState,
        future: updatedFuture,
        isChanging: false
      };
    }
    default: {
        return state;
    }
  }
};
