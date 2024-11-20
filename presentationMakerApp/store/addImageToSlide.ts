import {EditorType, ImgObj} from "/Frontend/presentationMaker/source/presentationMaker";
import { v4 as uuidv4 } from 'uuid';
function addImageToSlide(editor: EditorType, newImage: ImgObj): EditorType {
    newImage.id = uuidv4();
    const slideId = editor.selection.slideId;

    return {
        ...editor,
        selection: {slideId: slideId, elementId: newImage.id},
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(slide => slide.id === editor.selection.slideId
                 ? {...slide, elements: [...slide.elements, newImage]} : slide)
        }
    }
}

export {
    addImageToSlide,
}