import {EditorType, Slide} from '../../../types/presentationMaker.ts';
import {v4 as uuidv4} from 'uuid';

export function addSlide(editor: EditorType): EditorType {
    console.log(editor.selection)
    let insertIndex = 0
    insertIndex = editor.presentation.slides.findIndex(slide => slide.id === editor.selection[editor.selection.length - 1].slideId);
    const newSlide: Slide = {
        id: uuidv4(),
        elements: [],
        background: 'white'
    };
    const newSlides = [...editor.presentation.slides]; 
    
    newSlides.splice(insertIndex + 1, 0, newSlide);
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: newSlides 
        },
        selection: [{
            slideId: newSlide.id,
            elementId: ''
        }]
    }
}

