import { updateElementAction } from '../../../../store/actions/editorSlideElementsActions';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { ImgButton } from '../../../components/button/Button';
import styles from '../TopPanel.module.css';
import { useState } from 'react';

export const ChangeFontFamily = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.present.selection[0] || { slideId: '', elementId: '' });
  const element = ((useAppSelector((state) => state.present.presentation.slides)
    .find((slide) => slide.id === selected.slideId))
    ?.elements.find((el) => el.id === selected.elementId));

  const fontList = ['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Times New Roman', 'Impact', 'Comic Sans MS', 'IBMPlexSans-Regular'];

  const applyFontFamily = (font: string) => {
    if (element?.type === 'text') {
      const newElement = { ...element, fontFamily: font };
      dispatch(updateElementAction(newElement));
    }
    setIsChoosing(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <ImgButton
        className={styles.toolbarbutton}
        img={'../../../icons/toppaneleditorview/change-font-family.png'}
        onClick={() => setIsChoosing(!isChoosing)}
      />
      {isChoosing && (
        <ul
          style={{
            position: 'absolute',
            left: 0,
            width: '150px',
            height: '300px',
            overflowY: 'auto',
            padding: '5px',
            backgroundColor: 'rgba(209,207,255,1)',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.7)',
            zIndex: 100,
            listStyleType: 'none',
          }}
        >
          {fontList.map((font) => (
            <li
              key={font}
              onClick={() => applyFontFamily(font)}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
                fontFamily: font,
                color: 'rgb(30, 42, 120)',
                border: '3px solid transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.border = '3px solid rgb(30, 42, 120)')}
              onMouseLeave={(e) => (e.currentTarget.style.border = '3px solid transparent')}
            >
              {font}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
