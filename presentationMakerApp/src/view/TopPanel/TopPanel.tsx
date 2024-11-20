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
    dispatch(addSlide)
  }
  function onRemoveSlide() {
      dispatch(removeSlide)
  }
  const onTitleChange: React.ChangeEventHandler = (event) => {
      dispatch(renamePresentationTitle, (event.target as HTMLInputElement).value)
  }
  function onChangeSlideBackground() {
    dispatch(changeSlideBackground, '#D2D2D2')
  }
  function onAddImageToSlide() {
    const imgObj = {
      id: '',
      type: ElementType.image, 
      src: 'https://www.pravmir.ru/wp-content/uploads/2023/07/comedy-pet-photography-awards-2023-64b0e94571574__880-936x560.jpeg',
      size: {width: 200, height: 200},
      pos: {x: 10, y: 100}
    };
    dispatch(addImageToSlide, imgObj)
  }
  function onAddTextToSlide() {
    const textObj = {
      id: '',
      type: ElementType.text,
      fontSize: 20,
      fontFamily: '', 
      src: 'Смешно, как иногда случайное становится судьбоносным, а предназначенное превращается в случайное. Жизнь играет с нами в свои замысловатые игры, бросая вызов нашим ожиданиям и планам. Впереди - бесконечные возможности, за каждым поворотом кроется удивительное приключение. Даже в хаосе случайностей мы находим свою уникальную судьбу.',
      size: {width: 700, height: 200},
      pos: {x: 230, y: 100}
    };
    dispatch(addTextToSlide, textObj)
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
      </div>
      </>
    );
  };