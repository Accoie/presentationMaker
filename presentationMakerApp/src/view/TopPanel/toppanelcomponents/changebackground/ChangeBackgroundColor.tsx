import styles from './ChangeBackgroundColor.module.css';
import { changeSlideBackgroundAction } from '../../../../../store/actions/editorSlidesActions.ts'
import { useAppDispatch } from '../../../../../store/store.ts';
import { useState } from 'react';
import GradientPicker from 'react-best-gradient-color-picker'


export const ChangeBackgroundColor = () => {

  const [gradient, setGradient] = useState('');
  const dispatch = useAppDispatch();

  const handleGradientChange = (newGradient: string) => {
    setGradient(newGradient);
    dispatch(changeSlideBackgroundAction(newGradient as string))
  };
 
  return (
    <div className={styles.wrapper}>
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
        </div>
    </div>
  )
}
