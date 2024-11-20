import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'
import { Element } from './SlideElement'
import './Slide.css'
export const SLIDE_WIDTH = 935
export const SLIDE_HEIGHT = 525
import { dispatch } from '../../../store/editor'
import { setSelection } from '../../../store/setSelection'
import { PresentationSelection } from '../../../../source/presentationMaker'

type SlideProps = {
    slide: tools.Slide,
    scale?: number,
    selected: PresentationSelection,
}

export const Slide = ({slide, scale = 1, selected}: SlideProps) => {
    const isSelected = slide.id === selected.slideId;
    function onElementClick(slideId: string, elementId: string) {
        dispatch(setSelection, {
            slideId: slideId, elementId: elementId
        }
      )
    }
    const slideStyles:CSSProperties = {
        backgroundColor: slide.background,
        width: `${SLIDE_WIDTH * scale}px`,
        height: `${SLIDE_HEIGHT * scale}px`,
        

    }
    if (isSelected) {
        slideStyles.border = '4px solid #1E2A78'
    }
    return (
        <div className='slide' style={slideStyles}>
        {slide.elements.map((element) => (
            <div onClick={() => onElementClick(slide.id, element.id)}>
                <Element  element = {element} scale = {scale} selected={selected}/>
            </div>
          ))}
        </div>
    );
};