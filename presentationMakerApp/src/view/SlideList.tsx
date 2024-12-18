import React, { useState} from 'react';
import { Slide } from "./slide/Slide";
import styles from './SlideList.module.css';
import * as tools from "../../../source/presentationMaker.ts";
import { useDispatch } from 'react-redux';

type SlidesListProps = {
  slidesList: tools.Slide[], 
  selected: { slideId: string, elementId: string },
};

export const SlidesList = ({ slidesList, selected }: SlidesListProps) => {
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const dispatch = useDispatch();
  function onSlideClick(slideId: string) {
    console.log('sdfdsfasdfasdfasdfasd');
    dispatch({type: 'SET_SELECTION', payload: {slideId: slideId, elementId: ''}});
  }

  function onDragStart(slideId: string) {
    
    setDraggedSlideId(slideId);
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
    dispatch({type: 'UPDATE_SLIDES', payload: updatedSlides});
    

    setDraggedSlideId(null);
  }
  const defaultSelected = {slideId: selected.slideId, elementId: ''};
  return (
    <div className={styles.slideslist}>
      {slidesList.map((slide) => (
        <div style={{display: 'flex'}} key={slide.id}>
          <div className={styles.numberslide}>{slidesList.indexOf(slide) + 1}</div>
          <div
            className={`${styles.slideContainer} ${selected.slideId === slide.id ? styles.selected : ''}`}
            draggable
            onDragStartCapture={() => onDragStart(slide.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(slide.id)}
            onMouseDownCapture={() => onSlideClick(slide.id)}
          >
            <Slide slide={slide} scale={0.15} selected={defaultSelected} />
          </div>
        </div>
      ))}
    </div>
  );
};
