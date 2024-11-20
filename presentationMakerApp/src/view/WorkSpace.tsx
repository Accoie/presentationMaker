import { Slide } from "./slide/Slide";
import * as tools from "/Frontend/presentationMaker/source/presentationMaker"
import styles from './WorkSpace.module.css'

type WorkSpaceProps = {
  presentationData: tools.Presentation,
  selected: tools.PresentationSelection
}
export const WorkSpace = ({presentationData, selected} : WorkSpaceProps) => {
    const selectedSlide = presentationData.slides.find((slide) => slide.id === selected.slideId);
    if (!selectedSlide) {
      return (
        <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
          <div style={{padding: 10, fontFamily: 'Calibri', fontSize: 42, width: '100%'}}>Слайд не выбран</div>
          <img src='https://cdn-icons-png.flaticon.com/512/1178/1178479.png' style ={{width: '40%', height: '30%'}}></img>
        </div>
      )
    }
    return (
          <div className={styles.workspace} key={selectedSlide.id}>
            <div className={styles.scrollcontainer}>
              <Slide slide={selectedSlide} selected={{slideId:'', elementId: selected.elementId}}/>
            </div>
          </div>
    );
  };
  