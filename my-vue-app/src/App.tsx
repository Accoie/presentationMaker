import React from 'react'
import './App.css'
import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import {maximalPresentation, minimalPresentation} from '/Frontend/presentationMaker/my-vue-app/store/data'
import { ToolPanel } from './view/ToolPanel.tsx'
import { SlidesList } from './view/SlideList.tsx'
import { WorkSpace } from './view/WorkSpace.tsx'

const Presentations = ({ presentationData } : {presentationData : tools.Presentation}) => {
  return (
    <div className='presentation'>
      {presentationData.title ? (
        <h2 className='title'>
          {presentationData.title}
        </h2>
      ) : (
        <h2 className='title'>
          Нет заголовка презентации
        </h2>
      )}
      <ToolPanel presentationData={presentationData} />
      <div className='presentation-container'>
          <SlidesList slidesList={presentationData.slides} selectedSlideId={presentationData.selection.slideId} />
          <WorkSpace presentationData={presentationData} />
      </div>
    </div>
  );
};
function App() {
  return (
    <Presentations presentationData={maximalPresentation} />
  )
}

export default App
