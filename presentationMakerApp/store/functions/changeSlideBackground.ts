import { EditorType } from '/Frontend/presentationMaker/types/presentationMaker';

export function changeSlideBackground(editor: EditorType, newBackground: string): EditorType {
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(slide => slide.id === editor.selection[0].slideId
                 ? {...slide, background: newBackground} : slide)
        }
    };
}