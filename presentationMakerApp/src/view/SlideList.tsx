import { Slide } from "./slide/Slide";
import * as tools from "/Frontend/presentationMaker/source/presentationMaker"
import styles from './SlideList.module.css'
import {dispatch} from "../../store/editor.ts";
import {setSelection} from "../../store/setSelection.ts";

export const SlidesList = ({slidesList, selected} : {slidesList: tools.Presentation["slides"], selected: tools.PresentationSelection}) => {
    let slideIndex = 0;
    function onSlideClick(slideId: string) {
        dispatch(setSelection, {
            slideId: slideId, elementId: ''
        }
      )
    }
    return (
      <div className={styles.slideslist}>
        {slidesList.map((slide) => (
          <div style = {{display: 'flex', paddingBottom: '20px'}} onClick={() => onSlideClick(slide.id)} key={slide.id}>
            <div className={styles.numberslide}>{slideIndex = slideIndex + 1}</div>
            <Slide slide={slide} scale={0.2} selected={selected}/>
          </div>
      ))}
      </div>
    );
  };