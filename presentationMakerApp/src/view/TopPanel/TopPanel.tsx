import styles from './TopPanel.module.css';
import React from 'react';
import { Button } from '../../components/button/Button.tsx';
import {dispatch} from '/Frontend/presentationMaker/presentationMakerApp/store/editor.ts';
import {removeSlide} from '/Frontend/presentationMaker/presentationMakerApp/store/removeSlide.ts';
import {renamePresentationTitle} from '/Frontend/presentationMaker/presentationMakerApp/store/renamePresentationTitle.ts';
import {addSlide} from '../../../store/addSlide.ts';
import { changeSlideBackground } from '../../../store/changeSlideBackground.ts';
import {addImageToSlide} from '../../../store/addImageToSlide.ts';
import { addTextToSlide} from '../../../store/addTextToSlide.ts'
import { ElementType } from '/Frontend/presentationMaker/source/presentationMaker.ts';
import {removeElement} from '../../../store/removeElement.ts'

type TopPanelProps = {
  presentationTitle: string,
}
export const TopPanel = ({presentationTitle} : TopPanelProps) => {
  

  function onAddSlide() {
    dispatch(addSlide);
  }
  function onRemoveSlide() {
      dispatch(removeSlide)
  }
  const onTitleChange: React.ChangeEventHandler = (event) => {
      dispatch(renamePresentationTitle, (event.target as HTMLInputElement).value)
  }
  function onChangeSlideBackground() {
    const color = (document.getElementById('colorPicker') as HTMLInputElement).value;
    dispatch(changeSlideBackground, color)
  }
  function onAddImageToSlide() {
    const imageUrl = prompt('Введите URL-адрес картинки');
  
    if (imageUrl) {
        // Создаем объект для изображения на основе введенной ссылки
        const imgObj = {
            id: '',
            type: ElementType.image,
            src: imageUrl,
            size: { width: 200, height: 200 },
            pos: { x: 10, y: 100 }
        };
        
        // Вы можете добавить дополнительные проверки URL перед использованием, например, проверку на корректность URL.

        // Здесь будет ваша логика dispatch
        dispatch(addImageToSlide, imgObj);
    } else {
        alert('Вы не ввели URL-адрес!');
    }
  }
  function onAddTextToSlide() {
    const textContent = prompt('Введите текст');
    if(textContent){
      const textObj = {
        id: '',
        type: ElementType.text,
        fontSize: 20,
        fontFamily: '', 
        src: textContent,
        size: {width: 100, height: 200},
        pos: {x: 230, y: 100}
      };
      dispatch(addTextToSlide, textObj)
    }
    
  }
  function onRemoveElement() {
    dispatch(removeElement)
  }
    return (
      <>
      <input className={styles.title} type="text" defaultValue={presentationTitle} onChange={onTitleChange}/>
      <div className={styles.toolbar}>
        <Button className={styles.toolbarbutton} text={'Добавить слайд'} onClick={onAddSlide}></Button>
        <Button className={styles.toolbarbutton} text={'Удалить слайд'} onClick={onRemoveSlide}></Button>
        <Button className={styles.toolbarbutton} text={'Добавить картинку'} onClick={onAddImageToSlide}></Button>
        <Button className={styles.toolbarbutton} text={'Добавить текст'} onClick={onAddTextToSlide}></Button>
        <Button className={styles.toolbarbutton} text={'Удалить элемент'} onClick={onRemoveElement}></Button>  
        <Button className={styles.toolbarbutton} text={'Изменить фон'} onClick={onChangeSlideBackground}></Button>
        <input className = {styles.colorPicker} type="color" id="colorPicker" ></input>
      </div>
      </>
    );
  };