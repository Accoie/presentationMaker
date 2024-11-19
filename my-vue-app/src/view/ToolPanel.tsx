import './ToolPanel.css'
import React from 'react'
import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'

export const ToolPanel = ({presentationData} : {presentationData : tools.Presentation}) => {
    return (
      <div className='toolbar' style={{display: 'flex'}}>
        <button className='toolbar-button'>Создать/Удалить слайд</button>
        <button className='toolbar-button'>Добавить/Удалить элемент</button>
        <button className='toolbar-button'>Изменить фон</button>
        <button className='toolbar-button'>Изменить название</button>
      </div>
    );
  };