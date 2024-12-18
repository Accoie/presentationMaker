import * as tools from '../../../source/presentationMaker.ts'

const UPDATE_SLIDES = 'UPDATE_SLIDES';
const CHANGE_BACKGROUND = 'CHANGE_BACKGROUND';
const ADD_SLIDE = 'ADD_SLIDE';
const REMOVE_SLIDE = 'REMOVE_SLIDE';
export const updateSlidesAction = (newSlides: tools.Slide[]) => ({
    type: UPDATE_SLIDES,
    payload: newSlides,
});
export const changeSlideBackgroundAction = (newBackground: string) => ({
    type: CHANGE_BACKGROUND,
    payload: newBackground,
});
export const addSlideAction = () => ({
    type: ADD_SLIDE,
});
export const removeSlideAction = () => ({
    type: REMOVE_SLIDE,
})