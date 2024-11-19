import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'
import { Element } from './SlideElement'
import './Slide.css'
export const SLIDE_WIDTH = 935
export const SLIDE_HEIGHT = 525 

type SlideProps = {
    slide: tools.Slide,
    scale?: number,
    isSelected: boolean,
}

export const Slide = ({slide, scale = 1, isSelected}: SlideProps) => {
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
            <Element  element = {element} scale = {scale}/>
          ))}
        </div>
    );
};