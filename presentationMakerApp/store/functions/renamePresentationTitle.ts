import {EditorType} from '../../../source/presentationMaker';

function renamePresentationTitle(editor: EditorType, newTitle: string): EditorType {
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            title: newTitle,
        }
    }
}

export {
    renamePresentationTitle,
}