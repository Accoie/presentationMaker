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
    
}


export const Slide = ({slide, scale = 1, selected}: SlideProps) => {   
   
    const slideStyles:CSSProperties = {
        backgroundColor: slide.background,
        width: SLIDE_WIDTH * scale,
        height: SLIDE_HEIGHT * scale,
        position: 'relative',
    }
    
    
    return (
        <div className='slide' style={slideStyles} id = {selected.slideId}>
        {slide.elements.map((element) => (
            <Element  element = {element} scale = {scale} selected={selected}/>
          ))}
        </div>
    );
};