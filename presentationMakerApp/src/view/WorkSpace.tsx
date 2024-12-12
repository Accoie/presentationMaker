import { Slide } from "./slide/Slide";
import * as tools from "/Frontend/presentationMaker/source/presentationMaker"
import styles from './WorkSpace.module.css'
import { useEffect, useState } from "react";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "./slide/Slide";
type WorkSpaceProps = {
  presentationData: tools.Presentation,
  selected: tools.PresentationSelection,
}

export const WorkSpace = ({presentationData, selected} : WorkSpaceProps) => {
  const [scale, setScale] = useState(1); 

  const calculateScale = () => {
    const maxWidth = SLIDE_WIDTH + SLIDE_WIDTH* 0.3;
    const maxHeight = SLIDE_HEIGHT; 
    const scaleWidth = window.innerWidth / maxWidth;
    const scaleHeight = window.innerHeight / maxHeight;

  
    return Math.min(scaleWidth, scaleHeight) * 0.8;
  };

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale());
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
              <Slide slide={selectedSlide} scale = {scale} selected={{slideId: selected.slideId, elementId: selected.elementId}} />
            </div>
          </div>
    );
  };
  