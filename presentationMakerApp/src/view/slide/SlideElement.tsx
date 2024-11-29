import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide';
import { dispatch } from '../../../store/editor';
import { setSelection } from '../../../store/setSelection';
import React from 'react';
interface ElementProps {
    element: tools.SlideObj;
    scale: number;
    selected: tools.PresentationSelection;
    onUpdateElement: (updatedElement: tools.SlideObj) => void;
}
interface TextElementProps {
    element: tools.TextObj;
    scale: number;
}
interface ImgElementProps {
    element: tools.ImgObj;
}

export const TextElement = ({element, scale} : TextElementProps) => {
    const textElementStyles:CSSProperties = {
        fontSize: `${element.fontSize * scale}px`,
        fontFamily: element.fontFamily || 'Arial',
        width: '100%',
        height: '100%',
        
    }
    
    return (
        <div style={textElementStyles}>{element.src}</div>
    )
};
export const ImgElement = ({element}: ImgElementProps) => {
    const imgElementStyles:CSSProperties = {
        width: '100%',
        height: '100%',     
    }
    return (
        <img src={element.src} alt={element.id} style = {imgElementStyles}></img> 
    )
};

export const Element = ({element, scale, selected, onUpdateElement} : ElementProps) => {
    
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: element.pos.x * scale, y: element.pos.y * scale});

    const isSelected = selected.elementId === element.id;

    const handleMouseDown = (e: React.MouseEvent) => {
    if (element.id != selected.elementId) {
        setIsDragging(false);
        return;
        
    };
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    console.log('Начало');
    setDragOffset({
        x: e.clientX  - element.pos.x * scale,
        y: e.clientY  - element.pos.y * scale,
    });
    };

    const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging)  {console.log('Конец передвижения '); return;};

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    const updatedElement = {
        ...element,
        pos: {
        x: Math.max(0, Math.min(SLIDE_WIDTH - element.size.width, newX)),
        y: Math.max(0, Math.min(SLIDE_HEIGHT - element.size.height, newY)),
        },
    };
    onUpdateElement(updatedElement);
    };

    const handleMouseUp = () => {
    console.log('Конец');
    setIsDragging(false);
    };

    React.useEffect(() => {
    if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    }, [isDragging, dragOffset, element, scale]);

   function onElementClick(slideId: string, elementId: string) {
        dispatch(setSelection, {
            slideId, elementId
        }
      )
    }
    const clampedWidth = Math.min(element.size.width, SLIDE_WIDTH) - 4;
    const clampedHeight = Math.min(element.size.height, SLIDE_HEIGHT) - 6;
    const adjustedWidth = Math.min(clampedWidth * scale, SLIDE_WIDTH * scale - element.pos.x * scale);
    const adjustedHeight = Math.min(clampedHeight * scale, SLIDE_HEIGHT * scale - element.pos.y * scale);
    const elementStyles: CSSProperties = {
        cursor: isDragging ? 'grabbing' : "auto",
        width: adjustedWidth,
        height: adjustedHeight,
        position: 'absolute',
        top: element.pos.y * scale,
        left: element.pos.x * scale,
        borderWidth: `${4 * scale}px`,
        boxSizing: 'border-box',  
        borderStyle: 'dotted',
        borderColor: 'transparent'  
    }
    if (isSelected) {
        elementStyles.borderColor =  '#1E2A78';
    }
    return (
        <div style={elementStyles} onMouseDown={handleMouseDown}
        onClick={() => onElementClick(selected.slideId, element.id)} onDragStart={(e) => e.preventDefault()}>
        {element.type === tools.ElementType.text ? (
            <TextElement element = {element} scale = {scale}/>
          ) : element.type === tools.ElementType.image ? (
            <ImgElement element = {element}/>
          ) : (
              null
            )
          }
        </div>
    )
};