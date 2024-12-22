import {EditorType} from '/Frontend/presentationMaker/source/presentationMaker'

function removeSlide(editor: EditorType): EditorType {
    console.log('editor', editor)
    
    if (!editor.selection) {
        return editor
    }

    const removeSlideId = editor.selection.slideId
    const removeSlideIndex = editor.presentation.slides.findIndex(slide => slide.id == removeSlideId)
    const newSlides = editor.presentation.slides.filter(slide => slide.id != removeSlideId)

    let newSelectedSlideId = ''

    if (newSlides.length > 0) {
        const index = Math.min(removeSlideIndex, newSlides.length - 1)
        newSelectedSlideId = newSlides[index].id
    }

    return {
        presentation: {
            ...editor.presentation,
            slides: newSlides,
        },
        selection: {
            slideId: newSelectedSlideId,
            elementId: ''
        },
    }
}

export {
    removeSlide,
}