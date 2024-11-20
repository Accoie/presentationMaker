import {EditorType} from "/Frontend/presentationMaker/source/presentationMaker";

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