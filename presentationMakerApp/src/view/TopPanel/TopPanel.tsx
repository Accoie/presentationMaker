import styles from './TopPanel.module.css';
import React from 'react';
import { ImgButton } from '../../components/button/Button.tsx';
import { ElementType, ImgObj} from '/Frontend/presentationMaker/source/presentationMaker.ts';
import {addSlideAction, changeSlideBackgroundAction, removeSlideAction} from '../../../store/actions/editorSlidesActions.ts'
import {importImage} from '../../../store/functions/importImage.ts'
import {renamePresentationTitleAction} from '../../../store/actions/editorPresentationActions.ts'
import {exportEditorAction, importEditorAction, undoEditorAction, redoEditorAction} from '../../../store/actions/editorActions.ts'
import {removeElementAction, addImageToSlideAction, addTextToSlideAction} from '../../../store/actions/editorSlideElementsActions.ts'
import { TextObj } from '../../../../source/presentationMaker.ts';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { UndoableState } from '../../../store/store.ts';
import { generatePDF } from '../../../store/functions/generatePDF.ts';
type TopPanelProps = {
  presentationTitle: string,
}

export const TopPanel = ({presentationTitle} : TopPanelProps) => {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const dispatch = useAppDispatch();
  function onAddSlide() {
    dispatch(addSlideAction());
  }
  function onRemoveSlide() {
      dispatch(removeSlideAction())
  }
  const onTitleChange: React.ChangeEventHandler = (event) => {
      dispatch(renamePresentationTitleAction((event.target as HTMLInputElement).value))
  }
  function onChangeSlideBackground() {
    const color = (document.getElementById('colorPicker') as HTMLInputElement).value;
    dispatch(changeSlideBackgroundAction(color))
  }
  function onAddImageToSlide() {
    const imageUrl = prompt('Введите URL-адрес картинки');
    if (imageUrl) {
        const imgObj: ImgObj= {
            id: '',
            type: ElementType.image,
            src: imageUrl,
            size: { width: 200, height: 200 },
            pos: { x: 10, y: 100 }
        };

        dispatch(addImageToSlideAction(imgObj));
    } else {
        alert('Вы не ввели URL-адрес!');
    }
  }
  function onAddTextToSlide() {
    const textContent = prompt('Введите текст');
    if(textContent){
      const textObj: TextObj = {
        id: '',
        type: ElementType.text,
        fontSize: 20,
        fontFamily: 'Helvetica', 
        src: textContent,
        size: {width: 200, height: 200},
        pos: {x: 0, y: 0}
      };
      dispatch(addTextToSlideAction(textObj))
    }
    
  }
  function onImportEditorState() {

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';


    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const jsonString = reader.result as string;
            dispatch(importEditorAction(jsonString));  
            
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

    fileInput.click();
  }
  
  function onExportEditorState() {
    dispatch(exportEditorAction());
  }
  function onRemoveElement() {
    dispatch(removeElementAction());
  }
  function onUndo() {
    dispatch(undoEditorAction());
  }
  function onRedo() {
    dispatch(redoEditorAction());
  }
  
  function onGeneratePdf() {
    dispatch(generatePDF(editor));
  }
  
  const handleOpenModal = () => {
    dispatch(importImage());
  };
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
          <ImgButton className={styles.toolbarbutton} img={'https://cdn-icons-png.flaticon.com/128/8113/8113737.png'} onClick={onAddImageToSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://static-00.iconduck.com/assets.00/draw-text-icon-475x512-4z4gbgou.png'} onClick={onAddTextToSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://www.iconpacks.net/icons/2/free-minus-icon-3108-thumb.png'} onClick={onRemoveElement}></ImgButton>  
          <ImgButton className={styles.toolbarbutton} img={'https://cdn-icons-png.flaticon.com/512/483/483918.png'} onClick={onChangeSlideBackground}></ImgButton> 
          <input className = {styles.colorPicker} type="color" id="colorPicker" ></input>
          <ImgButton className={styles.toolbarbutton} img={'https://static-00.iconduck.com/assets.00/undo-icon-461x512-lujtd07h.png'} onClick={onUndo}></ImgButton>
          <ImgButton className={styles.toolbarredobutton} img={'https://static-00.iconduck.com/assets.00/undo-icon-461x512-lujtd07h.png'} onClick={onRedo}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://cdn-icons-png.flaticon.com/512/80/80942.png'} onClick={onGeneratePdf}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'https://cdn.icon-icons.com/icons2/2566/PNG/512/unsplash_icon_153496.png'} onClick={handleOpenModal}></ImgButton>
                
        </div>
         
      </div>
      </div>
    );
  };