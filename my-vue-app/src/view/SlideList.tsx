import { Slide } from "./slide/Slide";
import * as tools from "/Frontend/presentationMaker/source/presentationMaker"
import './SlideList.css'

export const SlidesList = ({slidesList, selectedSlideId} : {slidesList: tools.Presentation["slides"], selectedSlideId: string}) => {
    let slideIndex = 0;
    return (
      <div className='slides-list'>
        {slidesList.map((slide) => (
          <div style = {{display: 'flex', paddingBottom: '20px'}} key={slide.id}>
            <div style={{paddingRight: '3px', paddingLeft: '3px', color: '#1E2A78', fontFamily: 'Impact'}}>{slideIndex = slideIndex + 1}</div>
            <Slide slide={slide} scale={0.2} isSelected={slide.id === selectedSlideId}/>
          </div>
      ))}
      </div>
    );
  };