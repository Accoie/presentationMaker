import { updateElementAction } from '../../../../store/actions/editorSlideElementsActions';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { ImgButton } from '../../../components/button/Button';
import styles from '../TopPanel.module.css';
import { useState } from 'react';
import GradientColorPicker from 'react-best-gradient-color-picker';

export const ChangeTextColor = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.present.selection[0] || { slideId: '', elementId: '' });
  const element = ((useAppSelector((state) => state.present.presentation.slides)
    .find((slide) => slide.id === selected.slideId))
    ?.elements.find((el) => el.id === selected.elementId));

  const applyFontColor = (newColor: string) => {
    if (element?.type === 'text') {
      const newElement = { ...element, color: newColor };
      dispatch(updateElementAction(newElement));
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <ImgButton
        className={styles.toolbarbutton}
        img={'../../../icons/toppaneleditorview/change-text-color.png'}
        onClick={() => setIsChoosing(!isChoosing)}
      />
      {isChoosing && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            padding: '5px',
            backgroundColor: 'rgba(209,207,255,1)',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.7)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GradientColorPicker
            onChange={(color) => applyFontColor(color)}
            className={styles.gradientPicker}
            hidePresets
            width={170}
            height={100}
            hideAdvancedSliders
            hideColorGuide
            hideInputType
            hideGradientStop
            hideOpacity
            hideGradientType
            hideGradientControls
            hideInputs
            hideColorTypeBtns
          />
        </div>
      )}
    </div>
  );
};
