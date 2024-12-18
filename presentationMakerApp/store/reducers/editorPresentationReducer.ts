import { UnknownAction } from 'redux';
import * as tools from '/Frontend/presentationMaker/source/presentationMaker';
import { renamePresentationTitle } from '../functions/renamePresentationTitle';
import { setSelection } from '../functions/setSelection';


export const editorPresentationReducer = (state: tools.EditorType, action: UnknownAction): tools.EditorType => {
  switch (action.type) {
    case 'SET_SELECTION': {
        return setSelection(state, action.payload as tools.PresentationSelection);
    }
    case 'RENAME_TITLE': {
        return renamePresentationTitle(state, action.payload as string);
    }
    default: {
        return state;
    }
  }
};
