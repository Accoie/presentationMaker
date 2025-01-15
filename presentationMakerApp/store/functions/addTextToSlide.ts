import { EditorType, TextObj } from '../../../types/presentationMaker';
import { v4 as uuidv4 } from 'uuid';

function addTextToSlide(editor: EditorType, newText: TextObj): EditorType {
  newText.id = uuidv4();
  let slideId: string | undefined;
  if (editor.selection && editor.selection.length > 0 && editor.selection[0]) {
    slideId = editor.selection[0].slideId;
  } else {
    return { ...editor };
  }
  if (!slideId) {
    return { ...editor };
  }
  return {
    ...editor,
    selection: [
      {
        ...editor.selection[0],
        slideId: slideId,
        elementId: newText.id,
      },
    ],
    presentation: {
      ...editor.presentation,
      slides: editor.presentation.slides.map((slide) =>
        slide.id === slideId
          ? { ...slide, elements: [...slide.elements, newText] }
          : slide
      ),
    },
  };
}

export { addTextToSlide };
