import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import { CSSProperties} from 'react'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide';

import React from 'react';
import { useDispatch } from 'react-redux';

interface ElementProps {
    element: tools.SlideObj;
    scale: number;
    selected: tools.PresentationSelection;
}
interface TextElementProps {
    element: tools.TextObj;
    scale: number;
}
interface ImgElementProps {
    element: tools.ImgObj;
}

export const TextElement = ({ element, scale }: TextElementProps) => {
 
    const textElementStyles: CSSProperties = {
        fontSize: `${element.fontSize * scale}px`,
        fontFamily: element.fontFamily || 'Arial',
        width: '100%',
        height: '100%',
        overflowWrap: 'break-word',
    }
    
    return (
        <div style={textElementStyles}>
            {element.src}
        </div>
    )
};
export const ImgElement = ({ element }: ImgElementProps) => {
    const imgElementStyles: CSSProperties = {
        width: '100%',
        height: '100%',
    }

    return (
        <img src={element.src} alt={element.id} style={imgElementStyles} ></img>
    )
};

export const Element = ({ element, scale, selected }: ElementProps) => {
    const dispatch = useDispatch();
    const [isDragging, setIsDragging] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeDirection, setResizeDirection] = React.useState<string | null>(null);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
   
    const isSelected = selected.elementId === element.id;
    
    const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
    };

    const handleMouseMove = React.useCallback(
        (e: MouseEvent) => {
            
            e.stopPropagation(); 
                 
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                const updatedElement = {
                    ...element,
                    pos: {
                        x: Math.max(0, Math.min(SLIDE_WIDTH - 4 - element.size.width, newX / scale)),
                        y: Math.max(0, Math.min(SLIDE_HEIGHT - 4 - element.size.height, newY / scale)),
                    },
                };
                dispatch({type: 'UPDATE_ELEMENT', payload: updatedElement});
            }

            if (isResizing && resizeDirection) {
                const deltaX = e.movementX / scale;
                const deltaY = e.movementY / scale;

                let newWidth = element.size.width;
                let newHeight = element.size.height;
                let newX = element.pos.x;
                let newY = element.pos.y;

                if (resizeDirection.includes("right")) {
                    newWidth = Math.max(10, element.size.width + deltaX);
                }
                if (resizeDirection.includes("left")) {
                    newWidth = Math.max(10, element.size.width - deltaX);
                    newX = Math.min(SLIDE_WIDTH - newWidth, Math.max(0, element.pos.x + deltaX));
                }
                if (resizeDirection.includes("bottom")) {
                    newHeight = Math.max(10, element.size.height + deltaY);
                }
                if (resizeDirection.includes("top")) {
                    newHeight = Math.max(10, element.size.height - deltaY);
                    newY = Math.min(SLIDE_HEIGHT - newHeight, Math.max(0, element.pos.y + deltaY));
                }

                const updatedElement = {
                    ...element,
                    size: { width: newWidth, height: newHeight },
                    pos: { x: newX, y: newY },
                };

                dispatch({type: 'UPDATE_ELEMENT', payload: updatedElement});
            }
        },
        [isDragging, isResizing, resizeDirection, element, scale, dragOffset.x, dragOffset.y, dispatch]
    );

    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection(null);
    }, []);

    React.useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    function onElementClick(slideId: string, elementId: string) {
        dispatch({type: 'SET_SELECTION', payload:{ slideId, elementId }});
    }
    const handleMouseDown = (e: React.MouseEvent) => {
        if (selected.elementId) {
          e.preventDefault();
        }
        e.stopPropagation();
        onElementClick(selected.slideId, element.id);
        if (element.id !== selected.elementId) {
            setIsDragging(false);
            return;
        }
       
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - element.pos.x * scale,
            y: e.clientY - element.pos.y * scale,
        });
    };

    

    const elementStyles: CSSProperties = {
        cursor: isDragging ? "grabbing" : "auto",
        width: element.size.width * scale,
        height: element.size.height * scale,
        position: "absolute",
        top: element.pos.y * scale,
        left: element.pos.x * scale,
        borderWidth: `${4 * scale}px`,
        boxSizing: "border-box",
        borderStyle: "dotted",
        borderColor: isSelected ? "#1E2A78" : "transparent",
    };

    const handleStyles: CSSProperties = {
        position: "absolute",
        width: 8*scale,
        height: 8*scale,
        background: "#1E2A78",
    };

    const handlePositions = [
        { direction: "top-left", style: { top: -5*scale, left: -5*scale, cursor: "nwse-resize" } },
        { direction: "top-right", style: { top: -5*scale, right: -5*scale, cursor: "nesw-resize" } },
        { direction: "bottom-left", style: { bottom: -5*scale, left: -5*scale, cursor: "nesw-resize" } },
        { direction: "bottom-right", style: { bottom: -5*scale, right: -5*scale, cursor: "nwse-resize" } },
        { direction: "top", style: { top: -5*scale, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
        { direction: "bottom", style: { bottom: -5*scale, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
        { direction: "left", style: { top: "50%", left: -5*scale, transform: "translateY(-50%)", cursor: "ew-resize" } },
        { direction: "right", style: { top: "50%", right: -5*scale, transform: "translateY(-50%)", cursor: "ew-resize" } },
    ];

    return (
        <div
            style={elementStyles}
            onMouseDown={handleMouseDown}          

        >
            {isSelected &&
                handlePositions.map((handle) => (
                    <div
                        key={handle.direction}
                        style={{ ...handleStyles, ...handle.style }}
                        onMouseDown={handleResizeStart(handle.direction)}
                    ></div>
                ))}

            {element.type === tools.ElementType.text ? (
                <TextElement element={element} scale={scale} />
            ) : element.type === tools.ElementType.image ? (
                <ImgElement element={element} />
            ) : null}
        </div>
    );
};