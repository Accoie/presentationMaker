import { UnknownAction } from 'redux';
import * as tools from '../../../types/presentationMaker';
import { updateElement} from '../functions/updateSlideElement'
import {removeElement} from '../functions/removeElement'
import { addImageToSlide } from '../functions/addImageToSlide';
import { addTextToSlide } from '../functions/addTextToSlide';

export const editorSlideElementsReducer = (state: tools.EditorType, action: UnknownAction): tools.EditorType => {
  switch (action.type) {
    case 'UPDATE_ELEMENT': {
      return updateElement(state, action.payload as tools.SlideObj);
    }
    case 'REMOVE_ELEMENT': {
        return removeElement(state);
    }
    case 'ADD_IMAGE' : {
        return addImageToSlide(state, action.payload as tools.ImgObj)
    }
    case 'ADD_TEXT' : {
        return addTextToSlide(state, action.payload as tools.TextObj)
    }
    default:
      return state;
  }
};
