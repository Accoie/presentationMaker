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
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onSlideClick(slideId: string) {
    dispatch(setSelectionAction({ slideId: slideId, elementId: '' }));
  }

  function onDragStart(slideId: string, event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();

    // Найти смещение относительно начальной точки курсора
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    setOffset({ x: offsetX, y: offsetY });

    if (dragPreviewRef.current) {
      const previewElement = dragPreviewRef.current;
      previewElement.style.top = `${rect.top}px`;
      previewElement.style.left = `${rect.left}px`;
      previewElement.style.position = 'absolute';
      previewElement.style.pointerEvents = 'none';

      // Установить изображение для перетаскивания
      event.dataTransfer.setDragImage(previewElement, offsetX, offsetY);
      document.body.appendChild(previewElement); // Убедиться, что элемент видим
    }

    setDraggedSlideId(slideId);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }
  function onDragEnd() {
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.top = '-9999px';
      dragPreviewRef.current.style.left = '-9999px';
      dragPreviewRef.current.style.position = 'absolute';
    }
    setDraggedSlideId(null);
  }
  function onDrop(targetSlideId: string) {
    if (!draggedSlideId || draggedSlideId === targetSlideId) return;
  
    const draggedIndex = slidesList.findIndex((slide) => slide.id === draggedSlideId);
    const targetIndex = slidesList.findIndex((slide) => slide.id === targetSlideId);
  
    if (draggedIndex === -1 || targetIndex === -1) return;
  
    const updatedSlides = [...slidesList];
    [updatedSlides[draggedIndex], updatedSlides[targetIndex]] = [updatedSlides[targetIndex], updatedSlides[draggedIndex]];
    dispatch(updateSlidesAction(updatedSlides));
  
    // Сбрасываем dragPreviewRef
    onDragEnd();
  }

  const defaultSelected = { slideId: selected.slideId, elementId: '' };

  return (
    <div className={styles.slideslist}>
      {/* Превью перетаскиваемого элемента */}
      <div
        ref={dragPreviewRef}
        className={styles.dragPreview}
        style={{
          top: '-9999px',
          left: '-9999px',
          position: 'absolute',
          pointerEvents: 'none',
          border: '4px solid #1E2A78',
          borderRadius: '10px',
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

      {/* Список слайдов */}
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
