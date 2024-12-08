import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'
import { Element } from './SlideElement'
export const SLIDE_WIDTH = 935
export const SLIDE_HEIGHT = 525
import { PresentationSelection } from '../../../../source/presentationMaker'

type SlideProps = {
    slide: tools.Slide,
    scale?: number,
    selected: PresentationSelection,
    showBorder: boolean
}


export const Slide = ({slide, scale = 1, selected, showBorder}: SlideProps) => {   
    const isSelected = slide.id === selected.slideId;    
    const slideStyles:CSSProperties = {
        backgroundColor: slide.background,
        width: SLIDE_WIDTH * scale,
        height: SLIDE_HEIGHT * scale,
        boxSizing:'border-box',
        border: '4px solid transparent',
        borderRadius: '10px',
        position: 'relative',
    }
    if (isSelected && showBorder) {
        slideStyles.border = '4px solid #1E2A78'
    }
    
    return (
        <div className='slide' style={slideStyles}>
        {slide.elements.map((element) => (
            <Element  element = {element} scale = {scale} selected={selected}/>
          ))}
        <div></div>
        </div>
    );
};