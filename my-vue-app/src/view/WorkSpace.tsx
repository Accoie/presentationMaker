import { Slide } from "./slide/Slide";
import * as tools from "/Frontend/presentationMaker/source/presentationMaker"
import './WorkSpace.css'

export const WorkSpace = ({presentationData} : {presentationData: tools.Presentation}) => {
    const selectedSlide = presentationData.slides.find((slide) => slide.id === presentationData.selection.slideId);
    if (!selectedSlide) {
      return <div style={{padding: 10}}>Слайд не выбран</div>
    }
    return (
          <div className='work-space' key={selectedSlide.id}>
            <div className="scroll-container">
              <Slide slide={selectedSlide} isSelected={false}/>
            </div>
          </div>
    );
  };
  