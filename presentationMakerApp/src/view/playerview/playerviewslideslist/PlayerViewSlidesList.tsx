import { Slide } from '../.././slide/Slide.tsx';
import styles from './PlayerViewSlidesList.module.css'
import * as tools from '../../../../../types/presentationMaker.ts';
import {useAppDispatch } from '../../../../store/store.ts';
import { setSelectionAction } from '../../../../store/actions/editorPresentationActions.ts';

type SlidesListProps = {
  slidesList: tools.Slide[],
  selected: tools.Selection,
};

export const PlayerViewSlidesList = ({ slidesList, selected }: SlidesListProps) => {
  const defaultSelected = { slideId: selected.slideId, elementId: '' };
  const dispatch = useAppDispatch();

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = event.currentTarget;
    container.scrollLeft += event.deltaY;
  };

  return (
    <div className={styles.slideslist} id={'playerslideslist'} onWheel={handleWheel}>
      {slidesList.map((slide) => (
        <div style={{ display: 'flex' }} key={slide.id}>
          <div
            className={`${styles.slideContainer} ${selected.slideId === slide.id ? styles.selected : ''}`}
            onMouseDown={() => dispatch(setSelectionAction([{slideId: slide.id, elementId: ''}]))}
          >
            <Slide slide={slide} scale={0.15} selected={defaultSelected} isEditorView={false} isWorkspace={false}/>
          </div>
        </div>
      ))}
    </div>
  );
};
