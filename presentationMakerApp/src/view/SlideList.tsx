import React, { useState, useEffect } from 'react';
import { Slide } from "./slide/Slide";
import styles from './SlideList.module.css';
import * as tools from "../../../source/presentationMaker.ts";
import { dispatch } from '../../store/editor.ts';
import { setSelection } from '../../store/setSelection.ts';

type SlidesListProps = {
  slidesList: tools.Slide[], 
  selected: { slideId: string, elementId: string },
  onUpdateSlides: (updatedSlides: tools.Slide[]) => void, 
};

export const SlidesList = ({ slidesList, selected, onUpdateSlides }: SlidesListProps) => {
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!isDragging) return;
      console.log('Mouse moved at:', event.clientX, event.clientY);
    }

    function handleMouseUp() {
      if (isDragging) {
        setIsDragging(false);
        setDraggedSlideId(null);
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  function onSlideClick(slideId: string) {
    dispatch(setSelection, {
      slideId: slideId, 
      elementId: ''
    });
  }

  function onDragStart(slideId: string) {
    setDraggedSlideId(slideId);
    setIsDragging(true);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault(); 
  }

  function onDrop(targetSlideId: string) {
    if (!draggedSlideId || draggedSlideId === targetSlideId) return;

    const draggedIndex = slidesList.findIndex((slide) => slide.id === draggedSlideId);
    const targetIndex = slidesList.findIndex((slide) => slide.id === targetSlideId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedSlides = [...slidesList];

    [updatedSlides[draggedIndex], updatedSlides[targetIndex]] = [updatedSlides[targetIndex], updatedSlides[draggedIndex]];

    onUpdateSlides(updatedSlides);

    setDraggedSlideId(null);
    setIsDragging(false);
  }

  return (
    <div className={styles.slideslist}>
      {slidesList.map((slide) => (
        <div style={{display: 'flex'}} key={slide.id}>
          <div className={styles.numberslide}>{slidesList.indexOf(slide) + 1}</div>
          <div
            className={styles.slideContainer}
            draggable
            onDragStart={() => onDragStart(slide.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(slide.id)}
            onClick={() => onSlideClick(slide.id)}
          >
            <Slide slide={slide} scale={0.15} selected={selected} showBorder={true}/>
          </div>
        </div>
      ))}
    </div>
  );
};
