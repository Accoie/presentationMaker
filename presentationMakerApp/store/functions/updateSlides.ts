import * as tools from "/Frontend//presentationMaker/source/presentationMaker"

export function updateSlides(editor: tools.EditorType, updatedSlides: tools.Slide[]) {
    return {
      ...editor,
      presentation: {
        ...editor.presentation,
        slides: updatedSlides,
      },
    }
  }