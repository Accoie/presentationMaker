import styles from './AddImagePopUp.module.css'
import { ActiveButton, StandartButton } from '../../../../components/button/Button.tsx'
import { useAppDispatch } from '../../../../../store/store.ts';
import { useRef, useState, useEffect } from 'react';
import { importImage } from '../../../../../store/functions/importImage.ts'
import {  addImageToSlideAction } from '../../../../../store/actions/editorSlideElementsActions.ts'
import { ElementType, ImgObj } from '../../../../../../types/presentationMaker.ts';
import { v4 as uuidv4 } from 'uuid';

export const AddImagePopUp=() => {
  const dispatch = useAppDispatch();
  const [showPopUp, setShowPopUp] = useState(false)
  const popUpRef = useRef<HTMLDivElement>(null);
  let AddImagePopUpButton;
  if (!showPopUp) {
    AddImagePopUpButton = <StandartButton className={styles.filepopupbutton} img={'../../../icons/toppaneleditorview/ImportFromComputer.svg'} onClick={() => setShowPopUp(!showPopUp)} />
    } else {
      AddImagePopUpButton = <ActiveButton className={styles.filepopupbutton} img={'../../../icons/toppaneleditorview/ImportFromComp-focused.svg'} onClick={() => setShowPopUp(!showPopUp)} />
    }
    function onAddImageToSlide() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
    
        fileInput.addEventListener('change', async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
    
          if (file) {
            const reader = new FileReader();
    
            reader.onload = () => {
              const imageUrl = reader.result as string;
    
              const imgObj: ImgObj = {
                id: uuidv4(),
                type: ElementType.image,
                src: imageUrl,
                size: { width: 200, height: 200 },
                pos: { x: 10, y: 100 },
              };
    
              dispatch(addImageToSlideAction(imgObj));
            };
    
            reader.readAsDataURL(file);
          } else {
            alert('Вы не выбрали файл!');
          }
        });
    
        fileInput.click();
      }

  const handleOpenModal = (isBackgroundChange: boolean) => {
      dispatch(importImage(isBackgroundChange));
    };
    
  useEffect(() => {
        const handleMouseDown= (event: MouseEvent) => {
          if (
            
            !popUpRef.current?.contains(event.target as Node)
            
          ) {
            setShowPopUp(false);
          }
        };
        if(showPopUp ) {
          document.addEventListener('mousedown', handleMouseDown);
        }
        return () => {document.removeEventListener('mousedown', handleMouseDown)}
      },[showPopUp]);
return(
  
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingRight: '16px'}}>
          {/*здесь ссылка в img записывается относительно компонента ImgButton, который находится в components */}
          {AddImagePopUpButton}
          {showPopUp && 
            <div ref = {popUpRef} className={styles.popup}>
              <div className={styles.popupbutton} onClick={onAddImageToSlide}><img src={'../../../icons/toppaneleditorview/DownloadFromComputer.svg'}/></div>
              <div className = {styles.splitter}></div>

              <div className={styles.popupbutton} onClick={() => handleOpenModal(false)}><img src={'../../../icons/toppaneleditorview/DownloadFromInternet.svg'}/></div>
            </div>
          }
          
    </div>    
)
}
