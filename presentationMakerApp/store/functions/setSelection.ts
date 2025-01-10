import { EditorType, PresentationSelection } from '../../../types/presentationMaker.ts';

export function setSelection(editor: EditorType, newSelection: PresentationSelection): EditorType {
    return {
        ...editor,
        selection: newSelection,
    }
}
