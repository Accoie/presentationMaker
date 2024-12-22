import * as tools from '../../../source/presentationMaker.ts';
const SET_SELECTION = 'SET_SELECTION';
const RENAME_TITLE = 'RENAME_TITLE'
export const setSelectionAction = (newSelection: tools.PresentationSelection) => ({
  type: SET_SELECTION,
  payload: newSelection,
});
export const renamePresentationTitleAction = (newTitle: string) => ({
    type: RENAME_TITLE,
    payload: newTitle,
  });