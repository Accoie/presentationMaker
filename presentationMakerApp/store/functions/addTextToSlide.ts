import {EditorType, TextObj} from "/Frontend/presentationMaker/source/presentationMaker";
import { v4 as uuidv4 } from 'uuid';
function addTextToSlide(editor: EditorType, newText: TextObj): EditorType {
    newText.id = uuidv4();
    const slideId = editor.selection.slideId;
    return {
        ...editor,
        selection: {...editor.selection, slideId: slideId, elementId: newText.id},
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(slide => slide.id === editor.selection.slideId
                 ? {...slide, elements: [...slide.elements, newText]} : slide)
        }
    }
}

export {
    addTextToSlide,
}