import { updateElementAction } from '../../../../../store/actions/editorSlideElementsActions';
import { useAppSelector, useAppDispatch } from '../../../../../store/store';
import { StandartButton } from '../../../../components/button/Button';
import styles from './ChangeFontSize.module.css';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

export const ChangeFontSize = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.present.selection[0] || { slideId: '', elementId: '' });
  const element = ((useAppSelector((state) => state.present.presentation.slides)
    .find((slide) => slide.id === selected.slideId))
    ?.elements.find((el) => el.id === selected.elementId));
  
  const [fontSize, setFontSize] = useState<number | ''>('');
  useEffect(() => {
    if (element?.type === 'text' && element.fontSize) {
      setFontSize(element.fontSize);
    } else {
      setFontSize(20); 
    }
  }, [element]);
  function onChangeFontSize(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === '') {
      setFontSize('');
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setFontSize(parsedValue);
      }
    }
  }

  function applyFontSize() {
    if (fontSize !== '' && fontSize > 0) {
      if (element?.type === 'text') {
        const newElement = { ...element, fontSize: fontSize };
        dispatch(updateElementAction(newElement));
      }
    }
    setIsChoosing(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      applyFontSize();
    }
  }

  return (
    <div>
      {!isChoosing ? (
        <StandartButton
          className={styles.toolbarbutton}
          img={'../../../icons/toppaneleditorview/change-font-size.svg'}
          onClick={() => setIsChoosing(true)}
        />
      ) : (
        <input
          type='number'
          className={styles.inputchangesize}
          value={fontSize}
          onChange={onChangeFontSize}
          onBlur={applyFontSize}
          onKeyDown={onKeyDown}
          autoFocus
        />
      )}
    </div>
  );
};
