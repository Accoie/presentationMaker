import * as tools from "/Frontend//presentationMaker/source/presentationMaker"

export function updateElement(editor: tools.EditorType, newElement: tools.SlideObj): tools.EditorType {
    return {
        ...editor, 
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(slide => slide.id === editor.selection.slideId ?
             {...slide, elements: slide.elements.map(element => element.id === newElement.id ? {...element, ...newElement}: element) } : slide)
            }
    }
}
