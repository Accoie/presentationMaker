import * as tools from '../../../types/presentationMaker'

export function updateElement(editor: tools.EditorType, newElement: tools.SlideObj): tools.EditorType {
  let slideId: string | undefined;
  if (editor.selection && editor.selection.length > 0 && editor.selection[0]) {
    slideId = editor.selection[0].slideId;
  } else {
    return { ...editor };
  }
  return {
    ...editor,
    presentation: {
      ...editor.presentation,
      slides: editor.presentation.slides.map(slide => slide.id === slideId ?
        { ...slide, elements: slide.elements.map(element => element.id === newElement.id ? { ...element, ...newElement } : element) } : slide)
    }
  }
}
