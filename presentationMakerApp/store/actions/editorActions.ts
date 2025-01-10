import { EditorType } from '../../../source/presentationMaker';

const IMPORT_EDITOR = 'IMPORT_EDITOR';
const EXPORT_EDITOR = 'EXPORT_EDITOR';
const UNDO_EDITOR = 'UNDO_EDITOR';
const REDO_EDITOR = 'REDO_EDITOR';
const SET_IS_CHANGING = 'SET_IS_CHANGING';
const GENERATE_PDF = 'GENERATE_PDF';
const SHOW_PDF_MODAL = 'SHOW_PDF_MODAL';

export const importEditorAction = (jsonString: string) => ({
    type: IMPORT_EDITOR,
    payload: jsonString,
});

export const exportEditorAction = () => ({
    type: EXPORT_EDITOR,
});

export const undoEditorAction = () => ({
    type: UNDO_EDITOR
});

export const redoEditorAction = () => ({
    type: REDO_EDITOR
});

export const setIsChangingAction = (isChanging: boolean) => ({
    type: SET_IS_CHANGING,
    payload: isChanging
});

export const generatePDFAction = (editor: EditorType) => ({
    type: GENERATE_PDF,
    payload: editor
});

export const showPDFModalAction = (url: string, name: string) => ({
    type: SHOW_PDF_MODAL,
    payload: { url, name } as { url: string; name: string },
});