const IMPORT_EDITOR = 'IMPORT_EDITOR';
const EXPORT_EDITOR = 'EXPORT_EDITOR';

export const importEditorAction = (jsonString: string) => ({
    type: IMPORT_EDITOR,
    payload: jsonString,
});
export const exportEditorAction = () => ({
    type: EXPORT_EDITOR,
});