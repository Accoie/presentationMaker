import styles from './ChangeBackground.module.css';
import { ActiveButton, StandartButton } from '../../../../components/button/Button.tsx';
import { useAppDispatch } from '../../../../../store/store.ts';
import { useState, useRef, useEffect } from 'react';
import { importImage } from '../../../../../store/functions/importImage.ts';
import { changeSlideBackgroundAction } from '../../../../../store/actions/editorSlidesActions.ts';
import { ChangeBackgroundColor } from './ChangeBackgroundColor.tsx';

export const ChangeBackground = () => {
  const dispatch = useAppDispatch();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showColorPopUp, setShowColorPopUp] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null); 
  const colorPopUpRef = useRef<HTMLDivElement>(null);

  let AddImagePopUpButton;
  if (!showPopUp) {
    AddImagePopUpButton = (
      <StandartButton
        className={styles.filepopupbutton}
        img={'../../../icons/toppaneleditorview/ChangeBackground.svg'}
        onClick={() => {
          setShowPopUp(!showPopUp);
          setShowColorPopUp(false);
        }}
      />
    );
  } else {
    AddImagePopUpButton = (
      <ActiveButton
        className={styles.filepopupbutton}
        img={'../../../icons/toppaneleditorview/ChangeBackground-focused.svg'}
        onClick={() => setShowPopUp(!showPopUp)}
      />
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result as string;
        dispatch(changeSlideBackgroundAction(`url(${base64Image}) no-repeat center center / cover`));
        console.log('Base64 Image:', base64Image);
      };

      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };

      reader.readAsDataURL(file);
    }
  };
  
  useEffect(() => {
    const handleMouseDown= (event: MouseEvent) => {
      if (
        
        !popupRef.current?.contains(event.target as Node) &&
        
        !colorPopUpRef.current?.contains(event.target as Node)
      ) {
        setShowPopUp(false);
        setShowColorPopUp(false);
      }
    };
    if(showPopUp || showColorPopUp) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => {document.removeEventListener('mousedown', handleMouseDown)}
  },[showPopUp, showColorPopUp]);

  
  const handleOpenModal = (isBackgroundChange: boolean) => {
    dispatch(importImage(isBackgroundChange));
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingRight: '16px' }}
    >
      {AddImagePopUpButton}
      {showPopUp && (
        <div className={styles.popup} ref={popupRef}>
          <div
            className={styles.popupbutton}
            onClick={() => setShowColorPopUp(!showColorPopUp)}
          >
            <img
              className={styles.toolbarbutton}
              src={'../../../icons/toppaneleditorview/ChangeBackgroundColor.svg'}
            />
          </div>
          <div className={styles.splitter}></div>
          <input
              id='fileInput'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className={styles.imageInputHidden}
            />
            <label htmlFor='fileInput' className={styles.imageInputLabel}>
            <div className={styles.popupbutton} onClick={() => handleImageChange}>
            <img
              className={styles.toolbarbutton}
              src={'../../../icons/toppaneleditorview/DownloadFromComputer.svg'}
            />
          </div>
            </label>
          
          <div className={styles.splitter}></div>
          <div className={styles.popupbutton} onClick={() => handleOpenModal(true)}>
            <img
              className={styles.toolbarbutton}
              src={'../../../icons/toppaneleditorview/DownloadFromInternet.svg'}
            />
          </div>
        </div>
      )}
      {showColorPopUp && (
        <div ref={colorPopUpRef}>
          <ChangeBackgroundColor />
        </div>
      )}
    </div>
  );
};
