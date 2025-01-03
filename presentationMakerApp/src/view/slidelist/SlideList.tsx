import React, { useRef, useState } from 'react';
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
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onSlideClick(slideId: string, event: React.MouseEvent<HTMLDivElement>) {
    if (event.ctrlKey || event.metaKey) {
      // Проверяем, выбран ли слайд
      const isAlreadySelected: boolean = selected.some((sel) => sel.slideId === slideId);
      let updatedSelection: PresentationSelection;
      if (isAlreadySelected && selected.length > 1) {
        updatedSelection = selected.filter((sel) => sel.slideId !== slideId) 
      } else if (!isAlreadySelected) {updatedSelection = [...selected, { slideId: slideId, elementId: '' }]} else {updatedSelection = [{ slideId: '', elementId: '' }]}
      dispatch(setSelectionAction(updatedSelection));
    } else {
      // Если не нажата Ctrl/Meta, выбираем только один слайд
      dispatch(setSelectionAction([{ slideId, elementId: '' }]));
    }
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
            selected={selected[0]}
            isEditorView={true}
          />
        )}
      </div>

      
      {slidesList.map((slide) => (
        <div
        className={`${styles.slideContainer} ${
          selected.some((sel) => sel.slideId === slide.id) ? styles.selected : ''
        }`}
        draggable
        onDragStartCapture={(event) => onDragStart(slide.id, event)}
        onDragOver={(event) => onDragOver(event)}
        onDrop={() => onDrop(slide.id)}
        onMouseDownCapture={(event) => {
          event.stopPropagation();
          onSlideClick(slide.id, event);
        }}
      >
        <Slide slide={slide} scale={0.15} selected={selected[0]} isEditorView={true} />
      </div>
      ))}
    </div>
  );
};
