import * as tools from '../../../types/presentationMaker.ts';

const UPDATE_ELEMENT = 'UPDATE_ELEMENT';
const REMOVE_ELEMENT = 'REMOVE_ELEMENT';
const ADD_IMAGE = 'ADD_IMAGE';
const ADD_TEXT = 'ADD_TEXT';

export const updateElementAction = (newElement: tools.SlideObj) => ({
  type: UPDATE_ELEMENT,
  payload: newElement,
});

export const removeElementAction = () => ({
    type: REMOVE_ELEMENT,
});

export const addImageToSlideAction = (newImg: tools.ImgObj) => ({
    type:  ADD_IMAGE,
    payload: newImg,
});

export const addTextToSlideAction = (newText: tools.TextObj) => ({
    type:  ADD_TEXT,
    payload: newText,
});
