import {EditorType, PresentationSelection} from '../../../source/presentationMaker.ts';

export function setSelection(editor: EditorType, newSelection: PresentationSelection): EditorType {
    console.log('SlideID: ', newSelection.slideId, ' ElementID: ', newSelection.elementId)
    return {
        ...editor,
        selection: newSelection,
    }
}
