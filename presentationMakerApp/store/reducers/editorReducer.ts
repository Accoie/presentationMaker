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

    case 'SHOW_PDF_MODAL': {
      console.log(state);
      const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        modal.style.zIndex = "9999";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";

        const iframe = document.createElement("iframe");
        iframe.id = "pdf-preview";
        iframe.style.width = "80%";
        iframe.style.height = "80%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "8px";
        iframe.src = action.payload as string;
  
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.padding = "10px";
        closeButton.style.backgroundColor = "#ff0000";
        closeButton.style.color = "#ffffff";
        closeButton.style.border = "none";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "16px";
  
        closeButton.onclick = () => {
          document.body.removeChild(modal);
        };
  
        modal.appendChild(iframe);
        modal.appendChild(closeButton);
        
        document.body.appendChild(modal);
      return state
    }
    default: {
        return state;
    }
  }
};
