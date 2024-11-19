import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {CSSProperties} from 'react'


interface ElementProps {
    element: tools.SlideObj;
    scale: number;
}
interface TextElementProps {
    element: tools.TextObj;
    scale: number;
}
interface ImgElementProps {
    element: tools.ImgObj;
    scale: number;
}
export const TextElement = ({element, scale} : TextElementProps) => {
    const textElementStyles:CSSProperties = {
        fontSize: `${element.fontSize * scale}px`,
        width: `${element.size.width * scale}px`,
        height: `${element.size.height * scale}px`,
        fontFamily: element.fontFamily || 'Arial',
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'absolute'
    }
    return (
        <div style={textElementStyles}>{element.src}</div>
    )
};
export const ImgElement = ({element, scale} : ImgElementProps) => {
    const imgElementStyles:CSSProperties = {
        width: `${element.size.width * scale}px`,
        height: `${element.size.height * scale}px`,
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'absolute'    
    }
    return (
        <img src={element.src} alt={element.id} style = {imgElementStyles}/>
    )
};
export const Element = ({element, scale} : ElementProps) => {
    return (
        <>
        {element.type === tools.ElementType.text ? (
            <TextElement element = {element} scale = {scale}/>
          ) : element.type === tools.ElementType.image ? (
            <ImgElement element = {element} scale = {scale}/>
          ) : (
              null
            )
          }
        </>
    )
};