import { UnknownAction } from 'redux';
import * as tools from '/Frontend/presentationMaker/source/presentationMaker';
import { importEditor} from '../functions/importEditor';
import {exportEditor} from '../functions/exportEditor';


export const editorReducer = (state: tools.EditorType, action: UnknownAction): tools.EditorType => {
  switch (action.type) {
    case 'IMPORT_EDITOR': {
        return importEditor(state, action.payload as string);
    }
    case 'EXPORT_EDITOR': {
        return exportEditor(state);
    }
    default: {
        return state;
    }
  }
};
