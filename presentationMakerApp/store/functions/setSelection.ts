import {EditorType, PresentationSelection} from '../../../source/presentationMaker.ts';

export function setSelection(editor: EditorType, newSelection: PresentationSelection): EditorType {
    return {
        ...editor,
        selection: newSelection,
    }
}
