import styles from './TopPanel.module.css';
import React from 'react';
import { ImgButton } from '../../components/button/Button.tsx';
import {dispatch, importEditorState, exportEditorState} from '/Frontend/presentationMaker/presentationMakerApp/store/editor.ts';
import {removeSlide} from '/Frontend/presentationMaker/presentationMakerApp/store/removeSlide.ts';
import {renamePresentationTitle} from '/Frontend/presentationMaker/presentationMakerApp/store/renamePresentationTitle.ts';
import {addSlide} from '../../../store/addSlide.ts';
import { changeSlideBackground } from '../../../store/changeSlideBackground.ts';
import {addImageToSlide} from '../../../store/addImageToSlide.ts';
import { addTextToSlide} from '../../../store/addTextToSlide.ts'
import { ElementType} from '/Frontend/presentationMaker/source/presentationMaker.ts';
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
        size: {width: 200, height: 200},
        pos: {x: 0, y: 0}
      };
      dispatch(addTextToSlide, textObj)
    }
    
  }
  function onImportEditorState() {
    // Создаём скрытый input для выбора файла
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    // Обработчик выбора файла
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const jsonString = reader.result as string;
            dispatch(importEditorState, jsonString);  
             // Отправляем в dispatch
            alert('Импорт завершён успешно!');
          } catch (error) {
            alert('Ошибка при импорте: некорректный JSON файл.');
            console.error('Error during import:', error);
          }
        };
        reader.onerror = () => {
          alert('Ошибка чтения файла.');
          console.error('FileReader error:', reader.error);
        };
        reader.readAsText(file);
      }
    });

    // Инициируем открытие диалога выбора файла
    fileInput.click();
  }
  function onExportEditorState() {
    exportEditorState();
  }
  function onRemoveElement() {
    dispatch(removeElement)
  }
    return (
      <div className={styles.toppanel}>
      <input className={styles.title} type="text" defaultValue={presentationTitle} onChange={onTitleChange}/>
      <div className={styles.toolbar}>
        <div className={styles.slideslisttoolbar}>
          <ImgButton className={styles.toolbarbutton} img={'https://static-00.iconduck.com/assets.00/import-icon-512x427-7l04qvae.png'} onClick={onImportEditorState}></ImgButton> 
          <ImgButton className={styles.toolbarbutton} img={'https://static-00.iconduck.com/assets.00/export-icon-2048x2045-dzj1wnpt.png'} onClick={onExportEditorState}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://cdn-icons-png.flaticon.com/512/13059/13059905.png'} onClick={onAddSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://mywebicons.ru/i/png/ff4ac0059617d939c4c210752d267a10.png'} onClick={onRemoveSlide}></ImgButton>
        </div>
        <div className={styles.workspacetoolbar}>
          <ImgButton className={styles.toolbarbutton} img={'https://icons.iconarchive.com/icons/praveen/minimal-outline/512/gallery-icon.png'} onClick={onAddImageToSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://static-00.iconduck.com/assets.00/draw-text-icon-475x512-4z4gbgou.png'} onClick={onAddTextToSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://www.iconpacks.net/icons/2/free-minus-icon-3108-thumb.png'} onClick={onRemoveElement}></ImgButton>  
          <ImgButton className={styles.toolbarbutton} img={'https://cdn4.iconfinder.com/data/icons/essentials-6/32/398-01-512.png'} onClick={onChangeSlideBackground}></ImgButton> 
          <input className = {styles.colorPicker} type="color" id="colorPicker" ></input>      
        </div>
         
      </div>
      </div>
    );
  };