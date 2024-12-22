import { Slide } from "./slide/Slide";
import * as tools from "/Frontend/presentationMaker/source/presentationMaker"
import styles from './WorkSpace.module.css'
import { useEffect, useState } from "react";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "./slide/Slide";
import { useAppDispatch } from "../../store/store";
import { setSelectionAction } from "../../store/actions/editorPresentationActions";
type WorkSpaceProps = {
  presentationData: tools.Presentation,
  selected: tools.PresentationSelection,
}

export const WorkSpace = ({presentationData, selected} : WorkSpaceProps) => {
  const [scale, setScale] = useState(1); 
  const dispatch = useAppDispatch();
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
  useEffect(() => {
          const handleClickOutside = (e: MouseEvent) => {
              // Проверяем, попал ли клик на элемент или его дочерние элементы
              const elementNode = document.getElementById(selected.slideId);
              console.log(e.target, elementNode)
              if (elementNode === e.target) {
                  dispatch(setSelectionAction({ slideId: selected.slideId, elementId: '' })); // Сбрасываем выделение
              }
          };
      
          document.addEventListener("mousedown", handleClickOutside);
      
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [selected.slideId, dispatch]);
    const selectedSlide = presentationData.slides.find((slide) => slide.id === selected.slideId);
    if (!selectedSlide) {
      return (
        <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', flexGrow: '1'}}>
          <div style={{padding: 10, fontFamily: 'Calibri', fontSize: 52, color: '#1E2A78'}}>Где слайды?</div>
          <img src='https://cdni.iconscout.com/illustration/premium/thumb/caucasian-man-getting-lost-in-forest-illustration-download-svg-png-gif-file-formats--scared-male-seeking-way-out-of-wood-dangerous-situation-people-pack-illustrations-9334975.png' style ={{width: 'auto', height: 'auto', filter: 'grayscale(0) sepia(1) hue-rotate(190deg) saturate(4.7) brightness(1)',}}></img>
        </div>
      )
    }
  
    return (
      
          <div className={styles.workspace} key={selected.slideId} id = {selected.slideId}>
            <div className={styles.scrollcontainer} key = {'sdfasdfasd'}>
              <Slide slide={selectedSlide} scale = {scale} selected={{slideId: selected.slideId, elementId: selected.elementId}} />
            </div>
          </div>
    );
  };
  