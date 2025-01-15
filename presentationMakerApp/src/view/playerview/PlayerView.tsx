import { useAppSelector, UndoableState, useAppDispatch } from '../../../store/store';
import { Slide } from '../slide/Slide';
import { useState, useEffect } from 'react';
import styles from './PlayerView.module.css';
import { PlayerViewSlidesList } from './playerviewslideslist/PlayerViewSlidesList';
import { PlayerPanel } from './playerpanel/playerpanel';
import { setSelectionAction } from '../../../store/actions/editorPresentationActions';

function Player() {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const slides = editor.presentation.slides;
  const dispatch = useAppDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const currentSlide = slides.find((slide) => slide.id === editor.selection[0].slideId);

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
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  });

  useEffect(() => {
    const updateScale = () => {
      const playerdownWidth: number = document.getElementById('playerdown')?.offsetWidth || 0;
      const screenWidth = isFullscreen
        ? window.innerWidth
        : window.innerWidth - playerdownWidth - 100;
      const screenHeight = window.innerHeight;
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
  const goToNextSlide = () => {

    const currentIndex = editor.presentation.slides.findIndex(
      (slide) => slide.id === editor.selection[0].slideId
    );

    if (currentIndex === -1) return;

    const nextIndex = Math.min(editor.presentation.slides.length - 1, currentIndex + 1);
    const slide = { ...editor.presentation.slides[nextIndex] };
    dispatch(setSelectionAction([{ slideId: slide.id, elementId: '' }]));
  };

  const goToPreviousSlide = () => {
    const currentIndex = editor.presentation.slides.findIndex(
      (slide) => slide.id === editor.selection[0].slideId
    );


    if (currentIndex === -1) return;

    const prevIndex = Math.max(0, currentIndex - 1);
    const slide = { ...editor.presentation.slides[prevIndex] };

    dispatch(setSelectionAction([{ slideId: slide.id, elementId: '' }]));
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      goToNextSlide();
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      goToPreviousSlide();
    }
  };
  useEffect(() => {

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  });

  useEffect(() => {
    let hidePanelTimeout: ReturnType<typeof setTimeout>;

    const showPanel = (event: MouseEvent) => {
      const movementThreshold = 3;
      if (Math.abs(event.movementX) < movementThreshold && Math.abs(event.movementY) < movementThreshold) {
        return;
      }
      setIsPanelVisible(true);
      clearTimeout(hidePanelTimeout);
      hidePanelTimeout = setTimeout(() => {
        setIsPanelVisible(false);
      }, 3000);
    };

    document.addEventListener('mousemove', showPanel);

    return () => {
      clearTimeout(hidePanelTimeout);
      document.removeEventListener('mousemove', showPanel);
    };
  }, []);

  return (
    <div className={styles.playercontainer}>
      {!isFullscreen && (
        <PlayerPanel
          isVisible={isPanelVisible}
          toggleFullscreen={toggleFullscreen}
        />)}
      <div style={{ margin: 'auto' }} id='player'>
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
        <div className={styles.playerviewslideslist} id='playerdown'>
          <PlayerViewSlidesList slidesList={slides} selected={editor.selection[0]} />
        </div>
      )}
    </div>
  );
}

export default Player;
