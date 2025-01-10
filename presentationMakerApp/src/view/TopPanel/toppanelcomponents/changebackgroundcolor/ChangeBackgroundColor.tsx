import styles from './ChangeBackgroundColor.module.css';
import React from 'react';
import { ImgButton } from '../../../../components/button/Button.tsx';
import { changeSlideBackgroundAction } from '../../../../../store/actions/editorSlidesActions.ts'
import { useAppDispatch } from '../../../../../store/store.ts';
import { useState } from 'react';
import GradientPicker from 'react-best-gradient-color-picker'
import { importImage } from '../../../../../store/functions/importImage.ts'

export const ChangeBackgroundColor = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [gradient, setGradient] = useState('');
  const dispatch = useAppDispatch();

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const handleOpenModal = (isBackgroundChange: boolean) => {
    dispatch(importImage(isBackgroundChange));
  };
  const handleGradientChange = (newGradient: string) => {
    setGradient(newGradient);
    dispatch(changeSlideBackgroundAction(newGradient as string))
  };

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
  return (
    <div className={styles.wrapper}>
      <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/change-background-color.png'} onClick={handleToggleOptions}></ImgButton>
      {showOptions && (
        <div className={styles.optionsContainer}>
          <div className={styles.option}>
            <GradientPicker
              value={gradient}
              onChange={handleGradientChange}
              className={styles.gradientPicker}
              hidePresets
              width={170}
              height={100}
              hideAdvancedSliders
              hideColorGuide
              hideInputType
              hideGradientStop
              hideOpacity
            />
          </div>
          <div className={styles.option}>
            <input
              id='fileInput'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className={styles.imageInputHidden}
            />
            <label htmlFor='fileInput' className={styles.imageInputLabel}>
              <ImgButton className={styles.imageInputbutton} img={'../../../icons/toppaneleditorview/add-image.png'} onClick={() => { }}></ImgButton>
            </label>
            <ImgButton className={styles.unsplashInputbutton} img={'../../../icons/toppaneleditorview/unsplash.png'} onClick={() => handleOpenModal(true)}></ImgButton>
          </div>

        </div>
      )}
    </div>
  )
}
