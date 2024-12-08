import styles from './TopPanel.module.css';
import React from 'react';
import { TextButton, ImgButton } from '../../components/button/Button.tsx';
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
        const imgObj = {
            id: '',
            type: ElementType.image,
            src: imageUrl,
            size: { width: 200, height: 200 },
            pos: { x: 10, y: 100 }
        };

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
  function onImportEditorState() {}
  function onRemoveElement() {
    dispatch(removeElement)
  }
    return (
      <div className={styles.toppanel}>
      <input className={styles.title} type="text" defaultValue={presentationTitle} onChange={onTitleChange}/>
      <div className={styles.toolbar}>
        <TextButton className={styles.toolbarbutton} text={'Импортировать'} onClick={onImportEditorState}></TextButton>
        <ImgButton className={styles.toolbarbutton} img={'https://cdn-icons-png.flaticon.com/512/13059/13059905.png'} onClick={onAddSlide}></ImgButton>
        <ImgButton className={styles.toolbarbutton} img={'https://mywebicons.ru/i/png/ff4ac0059617d939c4c210752d267a10.png'} onClick={onRemoveSlide}></ImgButton>
        <ImgButton className={styles.toolbarbutton} img={'https://icons.iconarchive.com/icons/praveen/minimal-outline/512/gallery-icon.png'} onClick={onAddImageToSlide}></ImgButton>
        <ImgButton className={styles.toolbarbutton} img={'https://static-00.iconduck.com/assets.00/draw-text-icon-475x512-4z4gbgou.png'} onClick={onAddTextToSlide}></ImgButton>
        <ImgButton className={styles.toolbarbutton} img={'https://www.iconpacks.net/icons/2/free-minus-icon-3108-thumb.png'} onClick={onRemoveElement}></ImgButton>  
        <ImgButton className={styles.toolbarbutton} img={'https://cdn4.iconfinder.com/data/icons/essentials-6/32/398-01-512.png'} onClick={onChangeSlideBackground}></ImgButton> 
        <input className = {styles.colorPicker} type="color" id="colorPicker" ></input>       
      </div>
      </div>
    );
  };