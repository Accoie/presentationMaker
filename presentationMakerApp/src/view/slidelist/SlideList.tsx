import React, { useRef, useState } from 'react';
import { Slide } from ".././slide/Slide.tsx";
import styles from './SlideList.module.css';
import * as tools from "../../../../source/presentationMaker.ts";
import { useDispatch } from 'react-redux';
import { setSelectionAction } from '../../../store/actions/editorPresentationActions.ts';
import { updateSlidesAction } from '../../../store/actions/editorSlidesActions.ts';

type SlidesListProps = {
  slidesList: tools.Slide[], 
  selected: { slideId: string, elementId: string },
};

export const SlidesList = ({ slidesList, selected }: SlidesListProps) => {
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);

  function onSlideClick(slideId: string) {
    dispatch(setSelectionAction({ slideId: slideId, elementId: '' }));
  }

  function onDragStart(slideId: string, event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (dragPreviewRef.current) {
      const previewElement = dragPreviewRef.current;
      document.body.appendChild(previewElement); 
      event.dataTransfer.setDragImage(previewElement, 0, 0); 
    }

    setDraggedSlideId(slideId);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault(); 
    event.stopPropagation(); 
  }

  function onDrop(targetSlideId: string) {
    if (!draggedSlideId || draggedSlideId === targetSlideId) return;

    const draggedIndex = slidesList.findIndex((slide) => slide.id === draggedSlideId);
    const targetIndex = slidesList.findIndex((slide) => slide.id === targetSlideId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedSlides = [...slidesList];

    [updatedSlides[draggedIndex], updatedSlides[targetIndex]] = [updatedSlides[targetIndex], updatedSlides[draggedIndex]];
    dispatch(updateSlidesAction(updatedSlides));

    setDraggedSlideId(null);
  }

  const defaultSelected = { slideId: selected.slideId, elementId: '' };

  return (
    <div className={styles.slideslist}>
      <div
        ref={dragPreviewRef}
        className={styles.dragPreview}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          pointerEvents: 'none',
        }}
      >
        
        {draggedSlideId && (
          <Slide
            slide={slidesList.find((slide) => slide.id === draggedSlideId)!}
            scale={0.15}
            selected={defaultSelected}
            isEditorView={true}
          />
        )}
      </div>

      {slidesList.map((slide) => (
        <div style={{ display: 'flex' }} key={slide.id}>
          <div className={styles.numberslide}>{slidesList.indexOf(slide) + 1}</div>
          <div
            className={`${styles.slideContainer} ${selected.slideId === slide.id ? styles.selected : ''}`}
            draggable
            onDragStartCapture={(event) => onDragStart(slide.id, event)} 
            onDragOver={(event) => onDragOver(event)}
            onDrop={() => onDrop(slide.id)}
            onMouseDownCapture={(event) => {
              event.stopPropagation();
              onSlideClick(slide.id); 
            }}
          >
            <Slide slide={slide} scale={0.15} selected={defaultSelected} isEditorView={true}/>
          </div>
        </div>
      ))}
    </div>
  );
};
