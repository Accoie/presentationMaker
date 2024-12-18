import {EditorType, Slide} from '../../../source/presentationMaker.ts';
import { v4 as uuidv4 } from 'uuid';

function addSlide(editor: EditorType): EditorType {
    let insertIndex = 0
    insertIndex = editor.presentation.slides.findIndex(slide => slide.id === editor.selection.slideId);
    const newSlide: Slide = {
        id: uuidv4(),
        elements: [],
        background: 'white'
    };
    const newSlides = [...editor.presentation.slides]; // Создаем копию текущего массива слайдов
    
    newSlides.splice(insertIndex + 1, 0, newSlide);
    console.log(newSlides);
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: newSlides // Устанавливаем новый массив слайдов
        },
        selection: {
            slideId: newSlide.id,
            elementId: ''
        }
    }
}

export {
    addSlide,
}