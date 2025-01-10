import { useAppSelector, UndoableState, useAppDispatch } from '../../../store/store';
import { Slide } from '../slide/Slide';
import { useState, useEffect } from 'react';
import styles from './PlayerView.module.css';
import { setSelectionAction } from '../../../store/actions/editorPresentationActions';
import { PlayerViewSlidesList } from './playerviewslideslist/PlayerViewSlidesList';
import { PlayerPanel } from '../playerview/playerpanel/playerpanel';

function Player() {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const slides = editor.presentation.slides;
  const dispatch = useAppDispatch();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const currentSlide = slides.find((slide) => slide.id === editor.selection[0].slideId);

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goToNextSlide();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goToPreviousSlide();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const toggleFullscreen = () => {
    const playerContainer = document.documentElement;
    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch((err) => {
        console.error(`Ошибка входа в полноэкранный режим: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Ошибка выхода из полноэкранного режима: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  });

  useEffect(() => {
    const updateScale = () => {
      const playerpanelHeight: number = document.getElementById('playerdown')?.offsetHeight || 0;
      const screenWidth = window.innerWidth;
      const screenHeight = isFullscreen
        ? window.innerHeight
        : window.innerHeight - playerpanelHeight - 40;

      const scaleX = screenWidth / editor.presentation.sizeWorkspace.width;
      const scaleY = screenHeight / editor.presentation.sizeWorkspace.height;

      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [editor.presentation.sizeWorkspace.height, editor.presentation.sizeWorkspace.width, isFullscreen]);

  return (
    <div className={styles.playercontainer}>
      <div style={{ marginRight: 'auto', marginLeft: 'auto', width: 'auto' }} id="player">
        <div className={styles.slideContainer}>
          <Slide
            slide={currentSlide || slides[0]}
            selected={{ slideId: editor.selection[0].slideId, elementId: '' }}
            scale={scale + 0.01}
            isEditorView={false}
            isWorkspace={false}
          />
        </div>
      </div>

      {!isFullscreen && (
        <div style={{ width: '100%' }} id="playerdown">
          <PlayerPanel
            goToNextSlide={goToNextSlide}
            goToPreviousSlide={goToPreviousSlide}
            toggleFullscreen={toggleFullscreen}
          />
          <div className={styles.playerviewslideslist}>
            <PlayerViewSlidesList slidesList={slides} selected={editor.selection[0]} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Player;
