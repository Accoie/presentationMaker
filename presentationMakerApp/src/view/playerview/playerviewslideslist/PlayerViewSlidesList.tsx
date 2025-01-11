import { Slide } from '../.././slide/Slide.tsx';
import styles from './PlayerViewSlidesList.module.css'
import * as tools from '../../../../../types/presentationMaker.ts';
import {useAppDispatch } from '../../../../store/store.ts';
import { setSelectionAction } from '../../../../store/actions/editorPresentationActions.ts';
import { useEffect, useRef } from 'react';
type SlidesListProps = {
  slidesList: tools.Slide[],
  selected: tools.Selection,
};

export const PlayerViewSlidesList = ({ slidesList, selected }: SlidesListProps) => {
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const defaultSelected = { slideId: selected.slideId, elementId: '' };
  const dispatch = useAppDispatch();

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = event.currentTarget;
    container.scrollLeft += event.deltaY;
  };
useEffect(() => {
    if (selected.slideId) {
      const selectedSlideElement = slideRefs.current[selected.slideId]; 
      if (selectedSlideElement) {
        selectedSlideElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',  
          inline: 'center',  
        });
      }
    }
  }, [selected.slideId])
  return (
    <div className={styles.slideslist} id={'playerslideslist'} onWheel={handleWheel}>
      {slidesList.map((slide) => (
        <div style={{ display: 'flex', height: '100%' }} key={slide.id}>
          <div
            className={`${styles.slideContainer} ${selected.slideId === slide.id ? styles.selected : ''}`}
            onMouseDown={() => dispatch(setSelectionAction([{slideId: slide.id, elementId: ''}]))}
            key={slide.id}
            ref={(el) => {
            slideRefs.current[slide.id] = el; // Привязываем DOM-элемент к ID слайда
          }}
          >
            <Slide slide={slide} scale={0.15} selected={defaultSelected} isEditorView={false} isWorkspace={false}/>
          </div>
        </div>
      ))}
    </div>
  );
};
