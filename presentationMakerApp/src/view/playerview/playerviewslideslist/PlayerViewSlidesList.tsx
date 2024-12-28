
import { Slide } from "../.././slide/Slide.tsx";
import styles from './PlayerViewSlidesList.module.css'
import * as tools from "../../../../../source/presentationMaker.ts";


type SlidesListProps = {
  slidesList: tools.Slide[],
  selected: { slideId: string, elementId: string },
};

export const PlayerViewSlidesList = ({ slidesList, selected }: SlidesListProps) => {
  const defaultSelected = { slideId: selected.slideId, elementId: '' };

  return (
    <div className={styles.slideslist}>
      {slidesList.map((slide) => (
        <div style={{ display: 'flex' }} key={slide.id}>

          <div
            className={`${styles.slideContainer} ${selected.slideId === slide.id ? styles.selected : ''}`}
          >
            <Slide slide={slide} scale={0.15} selected={defaultSelected} isEditorView={false} />
          </div>
        </div>
      ))}
    </div>
  );
};
