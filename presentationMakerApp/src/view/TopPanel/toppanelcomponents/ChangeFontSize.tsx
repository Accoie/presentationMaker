import { updateElementAction } from '../../../../store/actions/editorSlideElementsActions';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { ImgButton } from '../../../components/button/Button';
import styles from '../TopPanel.module.css';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

export const ChangeFontSize = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [fontSize, setFontSize] = useState<number | ''>('');
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.present.selection[0] || { slideId: '', elementId: '' });
  const element = ((useAppSelector((state) => state.present.presentation.slides)
    .find((slide) => slide.id === selected.slideId))
    ?.elements.find((el) => el.id === selected.elementId));

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
    <>
      {!isChoosing ? (
        <ImgButton
          className={styles.toolbarbutton}
          img={'../../../icons/toppaneleditorview/change-font-size.png'}
          onClick={() => setIsChoosing(true)}
        />
      ) : (
        <input
          type='number'
          style={{ width: 40, height: 40, borderRadius: '5px', backgroundColor: '#dceaff', color: '#1e2a78', fontFamily: 'Impact' }}
          value={fontSize}
          onChange={onChangeFontSize}
          onBlur={applyFontSize}
          onKeyDown={onKeyDown}
          autoFocus
        />
      )}
    </>
  );
};
