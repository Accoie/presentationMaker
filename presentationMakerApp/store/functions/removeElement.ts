import {EditorType} from '/Frontend/presentationMaker/source/presentationMaker'

function removeElement(editor: EditorType): EditorType {
    return {
        ...editor, 
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(slide => slide.id === editor.selection[0].slideId ?
             {...slide, elements: slide.elements.filter(element => element.id !== editor.selection[0].elementId)} : slide)
            }
    }
}

export {
    removeElement,
}