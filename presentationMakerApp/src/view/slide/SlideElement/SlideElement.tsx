import * as tools from '../../../../../types/presentationMaker.ts'
import { CSSProperties } from 'react'
import { useAppSelector, UndoableState } from '../../../../store/store';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateElementAction } from '../../../../store/actions/editorSlideElementsActions';
import { setSelectionAction } from '../../../../store/actions/editorPresentationActions';
import { setIsChangingAction } from '../../../../store/actions/editorActions';
import { ImgElement } from './ImgElement';
import { TextElement } from './TextElement';

interface ElementProps {
  element: tools.SlideObj;
  scale: number;
  selected: tools.Selection;
  isEditorView: boolean;
  isWorkspace: boolean;
}

export const Element = React.memo(({ element, scale, selected, isEditorView, isWorkspace }: ElementProps) => {
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
            x: Math.max(0, Math.min(sizeSlide.width - element.size.width, newX / scale)),
            y: Math.max(0, Math.min(sizeSlide.height - element.size.height, newY / scale)),
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

        if (resizeDirection.includes('right')) {
          newWidth = Math.max(10, element.size.width + deltaX);
        }
        if (resizeDirection.includes('left')) {
          newWidth = Math.max(10, element.size.width - deltaX);
          newX = Math.min(sizeSlide.width - newWidth, Math.max(0, element.pos.x + deltaX));
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(10, element.size.height + deltaY);
        }
        if (resizeDirection.includes('top')) {
          newHeight = Math.max(10, element.size.height - deltaY);
          newY = Math.min(sizeSlide.height - newHeight, Math.max(0, element.pos.y + deltaY));
        }

        newWidth = Math.min(sizeSlide.width - newX, newWidth);
        newHeight = Math.min(sizeSlide.height - newY, newHeight);

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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  function onElementClick (slideId: string, elementId: string) {
    if(elementId !== selected?.elementId) {
      dispatch(setSelectionAction([{ slideId, elementId }]));
    }
  };

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
    cursor: isDragging ? 'grabbing' : 'auto',
    width: element.size.width * scale,
    height: element.size.height * scale,
    position: 'absolute',
    top: element.pos.y * scale,
    left: element.pos.x * scale,
    borderWidth: `${4 * scale}px`,
    boxSizing: 'border-box',
    borderStyle: 'dashed',
    borderColor: isSelected ? '#EB5E28' : 'transparent',
  };

  const handleStyles: CSSProperties = {
    position: 'absolute',
    width: 8 * scale,
    height: 8 * scale,
    background: '#EB5E28',
  };

  const handlePositions = [
    { direction: 'top-left', style: { top: -5 * scale, left: -5 * scale, cursor: 'nwse-resize' } },
    { direction: 'top-right', style: { top: -5 * scale, right: -5 * scale, cursor: 'nesw-resize' } },
    { direction: 'bottom-left', style: { bottom: -5 * scale, left: -5 * scale, cursor: 'nesw-resize' } },
    { direction: 'bottom-right', style: { bottom: -5 * scale, right: -5 * scale, cursor: 'nwse-resize' } },
    { direction: 'top', style: { top: -5 * scale, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' } },
    { direction: 'bottom', style: { bottom: -5 * scale, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' } },
    { direction: 'left', style: { top: '50%', left: -5 * scale, transform: 'translateY(-50%)', cursor: 'ew-resize' } },
    { direction: 'right', style: { top: '50%', right: -5 * scale, transform: 'translateY(-50%)', cursor: 'ew-resize' } },
  ];

  if (!isWorkspace) {
    return (
      <div style={elementStyles}>
        {element.type === tools.ElementType.text ? (
          <TextElement element={element} scale={scale} isEditorView={isEditorView} isWorkspace={isWorkspace} />
        ) : element.type === tools.ElementType.image ? (
          <ImgElement element={element} />
        ) : null}
      </div>
    );
  }

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
        <TextElement element={element} scale={scale} isEditorView={isEditorView} isWorkspace={isWorkspace} />
      ) : element.type === tools.ElementType.image ? (
        <ImgElement element={element} />
      ) : null}
    </div>
  ) : (
    <div style={elementStyles}>
      {element.type === tools.ElementType.text ? (
        <TextElement element={element} scale={scale} isEditorView={isEditorView} isWorkspace={isWorkspace} />
      ) : element.type === tools.ElementType.image ? (
        <ImgElement element={element} />
      ) : null}
    </div>
  );
});
