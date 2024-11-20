import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'


interface ElementProps {
    element: tools.SlideObj;
    scale: number;
    selected: tools.PresentationSelection;
}
interface TextElementProps {
    element: tools.TextObj;
    scale: number;
    isSelected: boolean;
}
interface ImgElementProps {
    element: tools.ImgObj;
    scale: number;
    isSelected: boolean;
}
export const TextElement = ({element, scale, isSelected} : TextElementProps) => {
    const textElementStyles:CSSProperties = {
        fontSize: `${element.fontSize * scale}px`,
        width: `${element.size.width * scale}px`,
        height: `${element.size.height * scale}px`,
        fontFamily: element.fontFamily || 'Arial',
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'absolute',
        top: element.pos.y * scale,
        left: element.pos.x * scale
    }
    if (isSelected) {
        textElementStyles.borderStyle = 'dotted'
        textElementStyles.borderColor =  '#1E2A78';
        textElementStyles.borderWidth = `${4 * scale}px`;
    }
    return (
        <div style={textElementStyles}>{element.src}</div>
    )
};
export const ImgElement = ({element, scale, isSelected} : ImgElementProps) => {
    const imgElementStyles:CSSProperties = {
        width: `${element.size.width * scale}px`,
        height: `${element.size.height * scale}px`,
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'absolute',
        top: element.pos.y * scale,
        left: element.pos.x * scale    
    }
    if (isSelected) {
        imgElementStyles.borderStyle = 'dotted'
        imgElementStyles.borderColor =  '#1E2A78';
        imgElementStyles.borderWidth = `${4 * scale}px`;
    }
    return (
        <img src={element.src} alt={element.id} style = {imgElementStyles}/>
    )
};
export const Element = ({element, scale, selected} : ElementProps) => {
    const isSelected = selected.elementId === element.id;
    return (
        <div >
        {element.type === tools.ElementType.text ? (
            <TextElement element = {element} scale = {scale} isSelected={isSelected}/>
          ) : element.type === tools.ElementType.image ? (
            <ImgElement element = {element} scale = {scale} isSelected={isSelected}/>
          ) : (
              null
            )
          }
        </div>
    )
};