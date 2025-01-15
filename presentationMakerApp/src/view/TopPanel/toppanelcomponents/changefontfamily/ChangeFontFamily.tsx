import { updateElementAction } from '../../../../../store/actions/editorSlideElementsActions';
import { useAppSelector, useAppDispatch } from '../../../../../store/store';
import { useRef, useState, useEffect } from 'react';
import styles from './ChangeFontFamily.module.css';

export const ChangeFontFamily = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.present.selection[0] || { slideId: '', elementId: '' });
  const element = ((useAppSelector((state) => state.present.presentation.slides)
    .find((slide) => slide.id === selected.slideId))
    ?.elements.find((el) => el.id === selected.elementId));
  const buttonRef = useRef<HTMLDivElement>(null);
  const popUpRef = useRef<HTMLUListElement>(null);
  const fontList = ['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Times New Roman', 'Impact', 'Comic Sans MS', 'IBMPlexSans', 'Ubuntu', 'Montserrat'];
  console.log(isChoosing)
  const arrow = !isChoosing ? <img className={styles.arrow} src='../../../../../icons/toppaneleditorview/arrow-down.svg'></img> : <img className={styles.arrowup} src='../../../../../icons/toppaneleditorview/arrow-down.svg'></img>
  console.log(arrow)
  const applyFontFamily = (font: string) => {
    if (element?.type === 'text') {
      const newElement = { ...element, fontFamily: font };
      dispatch(updateElementAction(newElement));
    }
    setIsChoosing(false);
  };
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        (!buttonRef.current?.contains(event.target as Node) &&
          !popUpRef.current?.contains(event.target as Node))
        && isChoosing
      ) {
        setIsChoosing(!isChoosing);
      }
    };
    if (isChoosing) {
      document.addEventListener('click', handleMouseDown);
    }
    return () => { document.removeEventListener('click', handleMouseDown) }
  }, [isChoosing]);
  return (
    <div className={styles.container}>
      <div
        ref={buttonRef}
        className={!isChoosing ? styles.button : styles.activebutton}
        onClick={() => setIsChoosing(!isChoosing)}
        style={{
          fontFamily: element?.type === 'text' ? element?.fontFamily : '',
        }}
      >
        {element?.type === 'text' ? element.fontFamily : ''}
        {arrow}
      </div>
      {isChoosing && (
        <ul id='fontlist' ref={popUpRef} className={styles.dropdown}>
          {fontList.map((font, index) => (
            <>
              {index > 0 && <div className={styles.separator}></div>}
              <li
                key={font}
                className={styles.listItem}
                onClick={() => applyFontFamily(font)}
                style={{
                  fontFamily: font,
                }}
              >
                {font}
              </li>
            </>
          ))}
        </ul>
      )}
    </div>
  );
};
