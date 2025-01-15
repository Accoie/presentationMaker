import { EditorType, Selection } from '../../../types/presentationMaker';

export function removeSlides(editor: EditorType): EditorType {
  if (!editor.selection) {
    return { ...editor }
  }
  const selectedSlideIds = editor.selection.map((sel: Selection) => sel.slideId);
  const newSlides = editor.presentation.slides.filter(
    slide => !selectedSlideIds.includes(slide.id)
  );
  let newSelectedSlideId = '';
  if (newSlides.length > 0) {
    const firstRemovedSlideIndex = editor.presentation.slides.findIndex(slide =>
      selectedSlideIds.includes(slide.id)
    );
    const index = Math.min(firstRemovedSlideIndex, newSlides.length - 1);
    newSelectedSlideId = newSlides[index].id;
  }
  return {
    presentation: {
      ...editor.presentation,
      slides: newSlides,
    },
    selection: newSelectedSlideId
      ? [{ slideId: newSelectedSlideId, elementId: '' }]
      : [],
  };
}