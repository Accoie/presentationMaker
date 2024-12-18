import { UnknownAction } from 'redux';
import * as tools from '/Frontend/presentationMaker/source/presentationMaker';
import {removeSlide} from '../functions/removeSlide'
import { addSlide } from '../functions/addSlide';
import { changeSlideBackground } from '../functions/changeSlideBackground'
import { updateSlides} from '../functions/updateSlides'

export const editorSlidesReducer = (state: tools.EditorType, action: UnknownAction): tools.EditorType => {
  switch (action.type) {
    case 'REMOVE_SLIDE': {
      return removeSlide(state);
    }
    case 'ADD_SLIDE': {
        return addSlide(state);
    }
    case 'CHANGE_BACKGROUND': {
        return changeSlideBackground(state, action.payload as string);
    }
    case 'UPDATE_SLIDES': {
        return updateSlides(state, action.payload as tools.Slide[])
    }
    default:
      return state;
  }
};
