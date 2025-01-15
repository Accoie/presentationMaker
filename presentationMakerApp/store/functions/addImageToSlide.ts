import { EditorType, ImgObj } from '../../../types/presentationMaker';
import { v4 as uuidv4 } from 'uuid';

export function addImageToSlide(editor: EditorType, newImage: ImgObj): EditorType {
  newImage.id = uuidv4();
  let slideId: string | undefined;
  if (editor.selection && editor.selection.length > 0 && editor.selection[0]) {
    slideId = editor.selection[0].slideId;
  } else {
    return { ...editor };
  }
  return {
    ...editor,
    selection: [
      {
        ...editor.selection[0],
        slideId: slideId,
        elementId: newImage.id,
      },
    ],
    presentation: {
      ...editor.presentation,
      slides: editor.presentation.slides.map((slide) =>
        slide.id === slideId
          ? { ...slide, elements: [...slide.elements, newImage] }
          : slide
      ),
    },
  }
}

