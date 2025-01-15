import { updateElementAction } from '../../../../store/actions/editorSlideElementsActions';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { ActiveButton, StandartButton } from '../../../components/button/Button';
import styles from '../TopPanel.module.css';
import { useRef, useState, useEffect} from 'react';
import GradientColorPicker from 'react-best-gradient-color-picker';

export const ChangeTextColor = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const dispatch = useAppDispatch();
  const popUpRef = useRef<HTMLDivElement>(null);
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
  let ChangeTextColorButton;
  
  if (!isChoosing) {
        ChangeTextColorButton = <StandartButton className='' img={'../../../icons/toppaneleditorview/change-text-color.svg'} onClick={() => setIsChoosing(!isChoosing)} />
    } else {
        ChangeTextColorButton =  <ActiveButton className='' img={'../../../icons/toppaneleditorview/change-text-color-enable.svg'} onClick={() => setIsChoosing(!isChoosing)} />
    }
  useEffect(() => {
        const handleMouseDown= (event: MouseEvent) => {
          if (
            
            !popUpRef.current?.contains(event.target as Node)
            
          ) {
            setIsChoosing(false);
          }
        };
        if(isChoosing ) {
          document.addEventListener('mousedown', handleMouseDown);
        }
        return () => {document.removeEventListener('mousedown', handleMouseDown)}
      },[isChoosing]);
  return (
    <div style={{position: 'relative', display:'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '16px'}}>
      
      {ChangeTextColorButton}
      {isChoosing && (
        <div
          ref={popUpRef}
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            padding: '5px',
            backgroundColor: '#484848',
            borderRadius: '5px',
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
