import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import { CSSProperties} from 'react'
import { useAppSelector, UndoableState } from '../../../store/store';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateElementAction } from '../../../store/actions/editorSlideElementsActions';
import { setSelectionAction } from '../../../store/actions/editorPresentationActions';
import { setIsChangingAction } from '../../../store/actions/editorActions';
interface ElementProps {
    element: tools.SlideObj;
    scale: number;
    selected: tools.PresentationSelection;
    isEditorView: boolean;
}
interface TextElementProps {
    element: tools.TextObj;
    scale: number;
    isEditorView: boolean;
}
interface ImgElementProps {
    element: tools.ImgObj;
}

export const TextElement = ({ element, scale, isEditorView}: TextElementProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [text, setText] = React.useState(element.src);
    const dispatch = useDispatch();
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null); // Реф для textarea
    
    
    const textElementStyles: CSSProperties = {
        fontSize: `${element.fontSize * scale}px`,
        fontFamily: element.fontFamily || 'Arial',
        width: '100%',
        height: '100%',
        overflowWrap: 'break-word',
        cursor: isEditing ? 'text' : 'default',
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (text !== element.src) {
            const updatedElement = { ...element, src: text }; 
            dispatch(updateElementAction(updatedElement));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBlur();
        }
    };

    React.useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
            
        }
    }, [isEditing]);

    return isEditing ? (
        <textarea
            ref={textareaRef} 
            style={{ ...textElementStyles, resize: 'none', border: '1px solid #ccc', padding: '4px', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
        />
    ) : isEditorView ?(
        <div style={textElementStyles} onDoubleClick={handleDoubleClick}>
            {element.src}
        </div>
    ): <div style={textElementStyles}>
    {element.src}
</div>
    ;
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

export const Element = ({ element, scale, selected, isEditorView }: ElementProps) => {
    const dispatch = useDispatch();
    const [isDragging, setIsDragging] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeDirection, setResizeDirection] = React.useState<string | null>(null);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    const sizeSlide = useAppSelector((state: UndoableState) => state.present.presentation.sizeWorkspace);
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
                        x: Math.max(0, Math.min(sizeSlide.width - 4 - element.size.width, newX / scale)),
                        y: Math.max(0, Math.min(sizeSlide.height - 4 - element.size.height, newY / scale)),
                    },
                };
                dispatch(setIsChangingAction(true));
                dispatch(updateElementAction(updatedElement));
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
                    newX = Math.min(sizeSlide.width - newWidth, Math.max(0, element.pos.x + deltaX));
                }
                if (resizeDirection.includes("bottom")) {
                    newHeight = Math.max(10, element.size.height + deltaY);
                }
                if (resizeDirection.includes("top")) {
                    newHeight = Math.max(10, element.size.height - deltaY);
                    newY = Math.min(sizeSlide.height - newHeight, Math.max(0, element.pos.y + deltaY));
                }

                const updatedElement = {
                    ...element,
                    size: { width: newWidth, height: newHeight },
                    pos: { x: newX, y: newY },
                };
                dispatch(setIsChangingAction(true));
                dispatch(updateElementAction(updatedElement));
            }
        },
        [isDragging, isResizing, resizeDirection, element, scale, dragOffset.x, dragOffset.y, dispatch, sizeSlide.width, sizeSlide.height]
    );

    const handleMouseUp = React.useCallback(() => {
        dispatch(setIsChangingAction(false));
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection(null);
    }, [dispatch]);

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
        dispatch(setSelectionAction({ slideId, elementId }));
    }
    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onElementClick(selected.slideId, element.id);
        e.preventDefault();
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

    return isEditorView ? (
        <div
            style={elementStyles}
            onMouseDown={handleMouseDown}
            id={element.id}
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
                <TextElement element={element} scale={scale} isEditorView={isEditorView}/>
            ) : element.type === tools.ElementType.image ? (
                <ImgElement element={element} />
            ) : null}
        </div>
    ) : (
        <div style={elementStyles}>
        {element.type === tools.ElementType.text ? (
            <TextElement element={element} scale={scale} isEditorView={isEditorView}/>
        ) : element.type === tools.ElementType.image ? (
            <ImgElement element={element} />
        ) : null}
        </div>
    );
};