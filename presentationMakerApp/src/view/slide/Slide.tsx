import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'
import { Element } from './SlideElement'

import { PresentationSelection } from '../../../../source/presentationMaker'
import { UndoableState, useAppSelector } from '../../../store/store'

type SlideProps = {
    slide: tools.Slide,
    scale?: number,
    selected: PresentationSelection,
    isEditorView: boolean
}


export const Slide = ({slide, scale = 1, selected, isEditorView}: SlideProps) => {   
      const sizeSlide = useAppSelector((state: UndoableState) => state.present.presentation.sizeWorkspace);
    
    const slideStyles:CSSProperties = {
        background: slide.background,
        width: sizeSlide.width * scale,
        height: sizeSlide.height * scale,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
    
    
    return (
        <div className='slide' style={slideStyles} id = {selected.slideId}>
        {slide.elements.map((element) => (
            <Element  element = {element} scale = {scale} selected={selected} isEditorView={isEditorView}/>
          ))}
        </div>
    );
};