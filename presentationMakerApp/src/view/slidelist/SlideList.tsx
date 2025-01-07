import React, { useState, useRef } from 'react';
import { Slide } from ".././slide/Slide.tsx";
import styles from './SlideList.module.css';
import * as tools from "../../../../source/presentationMaker.ts";
import { useDispatch } from 'react-redux';
import { setSelectionAction } from '../../../store/actions/editorPresentationActions.ts';
import { updateSlidesAction } from '../../../store/actions/editorSlidesActions.ts';
import { PresentationSelection } from '/Frontend/presentationMaker/source/presentationMaker.ts';

type SlidesListProps = {
  slidesList: tools.Slide[], 
  selected: tools.PresentationSelection,
};

export const SlidesList = ({ slidesList, selected }: SlidesListProps) => {
  const safeSelected: tools.Selection = selected[0] || { slideId: '', elementId: '' };
  const [draggedSlideIds, setDraggedSlideIds] = useState<string[]>([]);
  const [hoveredSlideId, setHoveredSlideId] = useState<string | null>(null);
  const [draggingGroupPosition, setDraggingGroupPosition] = useState<{ x: number; y: number } | null>(null);
  const [rectT, setRectT] = useState<DOMRect[]>([])
  const dispatch = useDispatch();

  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  function onSlideClick(slideId: string, event: React.MouseEvent<HTMLDivElement>) {
    if (event.ctrlKey || event.metaKey) {
      const isAlreadySelected: boolean = selected.some((sel) => sel.slideId === slideId);
      let updatedSelection: PresentationSelection;
      if (isAlreadySelected) {
        updatedSelection = selected.filter((sel) => sel.slideId !== slideId);
      } else {
        updatedSelection = [...selected, { slideId, elementId: '' }];
      }
      dispatch(setSelectionAction(updatedSelection));
    } else {
      dispatch(setSelectionAction([{ slideId, elementId: '' }])); 
    }
  }

  function onDragStart(slideId: string, event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();

    const selectedSlideIds = selected.map((sel) => sel.slideId);
    const isSlideSelected = selectedSlideIds.includes(slideId);
  
    let slidesToDrag = isSlideSelected ? selectedSlideIds : [slideId];
    slidesToDrag = slidesToDrag.sort(
      (a, b) => slidesList.findIndex((slide) => slide.id === a) - slidesList.findIndex((slide) => slide.id === b)
    );
  
    setDraggedSlideIds(slidesToDrag);
  
    const firstSlideElement = slideRefs.current[slidesToDrag[0]];
    const secondSlideElement = slideRefs.current[slidesToDrag[1]]
    if (firstSlideElement) {
      const firstRect = firstSlideElement.getBoundingClientRect();
      const secondRect = secondSlideElement?.getBoundingClientRect();
      if (secondRect) {
        setRectT([firstRect, secondRect]);
      } else {
        setRectT([firstRect]);
      }
      
    
    } else {
      
      setDraggingGroupPosition({ x: event.clientX, y: event.clientY });
    }
  }

  function onDrag(event: React.DragEvent<HTMLDivElement>) {
    if (draggingGroupPosition && draggedSlideIds.length > 1) {
      setDraggingGroupPosition({
        x: event.clientX,
        y: event.clientY + (((rectT[1]?.y || 0) - (rectT[0]?.y || 0))) * (draggedSlideIds.length - 1) / 2,
      });
    } else { 
      setDraggingGroupPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function onDragOver(slideId: string, event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setHoveredSlideId(slideId);
  }

  function onDragLeave() {
    setHoveredSlideId(null);
  }

  function onDragEnd() {
    setDraggedSlideIds([]);
    setHoveredSlideId(null);
    setDraggingGroupPosition(null);
  }

  function onDrop(targetSlideId: string) {
    if (!draggedSlideIds.length || draggedSlideIds.includes(targetSlideId)) {
      onDragEnd();
      return;
    }

    const draggedIndices = draggedSlideIds.map((id) => slidesList.findIndex((slide) => slide.id === id)).sort();
    const targetIndex = slidesList.findIndex((slide) => slide.id === targetSlideId);

    if (draggedIndices.includes(-1) || targetIndex === -1) return;

    const updatedSlides = [...slidesList];
    const draggedSlides = draggedIndices.map((index) => updatedSlides[index]);

    draggedIndices.reverse().forEach((index) => updatedSlides.splice(index, 1));

    const insertIndex = targetIndex > draggedIndices[0] ? targetIndex - draggedSlides.length + 1 : targetIndex;
    updatedSlides.splice(insertIndex, 0, ...draggedSlides);

    dispatch(updateSlidesAction(updatedSlides));
    onDragEnd();
  }

  return (
    <div className={styles.slideslist}>
      {draggedSlideIds.length > 0 && draggingGroupPosition && (
        <div
          className={styles.draggingGroup}
          style={{
            left: draggingGroupPosition.x,
            top: draggingGroupPosition.y,
            transform: 'translate(-50%, -50%)', 
            position: 'fixed',
            pointerEvents: 'none',
          }}
        >
          {draggedSlideIds.map((slideId) => {
            const slide = slidesList.find((s) => s.id === slideId);
            return (
              slide && (
                <div key={slide.id} className={styles.dragging}>
                  <Slide slide={slide} scale={0.15} selected={safeSelected} isEditorView={true} isWorkspace={false} />
                </div>
              )
            );
          })}
        </div>
      )}

      {slidesList.map((slide, index) => {
        const isDragging = draggedSlideIds.includes(slide.id);
        return (
          <div style={{display: 'flex'}}>
          <div className={styles.numberslide}>{index + 1}</div>
          <div
            key={slide.id}
            className={`${styles.slideContainer} ${
              selected.some((sel) => sel.slideId === slide.id) ? styles.selected : ''
            } ${hoveredSlideId === slide.id ? styles.hovered : ''}`}
            draggable
            onDragStartCapture={(event) => onDragStart(slide.id, event)}
            onDrag={(event) => onDrag(event)}
            onDragOver={(event) => onDragOver(slide.id, event)}
            onDrop={() => onDrop(slide.id)}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            onClick={(event) => {
              event.stopPropagation();
              onSlideClick(slide.id, event);
            }}
            style={{ opacity: isDragging ? 0 : 1, 
              
                }}
                ref={(el) => {
                  slideRefs.current[slide.id] = el;
                }}
          >
            
            <Slide slide={slide} scale={0.15} selected={safeSelected} isEditorView={true} isWorkspace={false} />
          </div>
          </div>
        );
        
      })}
    </div>
  );
};
