import { StandartButton, ToolPanelButton } from '../../../components/button/Button.tsx';
import styles from './PlayerPanel.module.css'
import { useAppSelector, UndoableState, useAppDispatch } from '../../../../store/store';
import { useNavigate } from 'react-router';
import { useState, CSSProperties, useRef } from 'react';

import { setSelectionAction } from '../../../../store/actions/editorPresentationActions';

interface PlayerPanelProps {
  isVisible: boolean;
  toggleFullscreen: () => void;
}

export const PlayerPanel = ({ isVisible, toggleFullscreen }: PlayerPanelProps) => {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = editor.presentation.slides;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const playerDownWidth = document.getElementById('playerdown')?.offsetWidth ?? 0;
  const playerPanelRef = useRef<HTMLDivElement>(null);

  const playerButtonStyles: CSSProperties = {
    top: '90%',
    backgroundColor: 'transparent',
    display: 'flex',
    position: 'fixed',
    zIndex: 999,
    left: `calc((100% - ${playerDownWidth}px + ${playerPanelRef.current?.offsetWidth}px) / 2 + ${playerDownWidth}px - ${playerPanelRef.current?.offsetWidth}px)`,
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(slides.length - 1, prevIndex + 1));
    const slide = { ...slides[Math.min(slides.length - 1, currentSlideIndex + 1)] };
    dispatch(setSelectionAction([{ slideId: slide.id, elementId: '' }]));
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(0, prevIndex - 1));
    const slide = { ...slides[Math.max(0, currentSlideIndex - 1)] };
    dispatch(setSelectionAction([{ slideId: slide.id, elementId: '' }]));
  };

  function handleGoToEditor() {
    return (
      navigate('/')
    )
  }
  
  return (
    <>
    <div className={`${styles.playerheader} ${isVisible ? styles.visible : ''}`} >
          <ToolPanelButton className={styles.gotoeditorbutton} img={'../../../icons/playerpanelplayerview/exit.svg'} onClick={() => { handleGoToEditor();}}/>
            <div className={styles.playertitle}>
              {editor.presentation.title}
           </div>
           <ToolPanelButton className={styles.fullscreenbutton} img={'../../../icons/playerpanelplayerview/fullscreen.svg'} onClick={toggleFullscreen}/>
        </div>
      <div ref={playerPanelRef} className={`${styles.playertools} ${isVisible ? styles.visible : ''}`} style={playerButtonStyles}>
        <StandartButton className={styles.playerundobutton} img={'../../../icons/playerpanelplayerview/prev.svg'} onClick={goToPreviousSlide} />
        <StandartButton className={styles.playerredobutton} img={'../../../icons/playerpanelplayerview/next.svg'} onClick={goToNextSlide} />
      </div>
    </>
  );
};
