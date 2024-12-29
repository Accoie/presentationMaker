import { useAppSelector, UndoableState, useAppDispatch } from "../../../store/store";
import { Slide } from "../slide/Slide";
import { useState, useEffect } from "react";
import styles from './PlayerView.module.css';
import { setSelectionAction } from "../../../store/actions/editorPresentationActions";
import { PlayerViewSlidesList } from "./playerviewslideslist/PlayerViewSlidesList";
import { PlayerPanel} from "./playerpanel/PlayerPanel.tsx";

function Player() {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const slides = editor.presentation.slides;
  const dispatch = useAppDispatch();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  editor.selection = { ...editor.selection, slideId: slides[currentSlideIndex].id, elementId: '' };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(slides.length - 1, prevIndex + 1));
    const slide = { ...slides[Math.min(slides.length - 1, currentSlideIndex + 1)] };
    dispatch(setSelectionAction({ slideId: slide.id, elementId: '' }));
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(0, prevIndex - 1));
    const slide = { ...slides[Math.max(0, currentSlideIndex - 1)] };
    dispatch(setSelectionAction({ slideId: slide.id, elementId: '' }));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      goToNextSlide();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
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
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  });

  useEffect(() => {
    const updateScale = () => {
      const pvslideslistHeight: number = document.getElementById('playerviewslideslist')?.offsetHeight || 0;
      const playerpanelHeight: number = document.getElementById('playerpanel')?.offsetHeight || 0;
      const screenWidth = window.innerWidth;
      const screenHeight = isFullscreen
        ? window.innerHeight
        : window.innerHeight - pvslideslistHeight - playerpanelHeight;

      const scaleX = screenWidth / editor.presentation.sizeWorkspace.width;
      const scaleY = screenHeight / editor.presentation.sizeWorkspace.height;

      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [editor.presentation.sizeWorkspace.height, editor.presentation.sizeWorkspace.width, isFullscreen]);

  return (
    <div className={styles.playercontainer}>
      <div style={{ marginRight: 'auto', marginLeft: 'auto', width: 'auto' }} id="player">
        <Slide
          slide={editor.presentation.slides[currentSlideIndex]}
          selected={{ slideId: editor.selection.slideId, elementId: "" }}
          scale={scale + 0.01}
          isEditorView={false}
        />
      </div>

      {!isFullscreen && (
        <>
          <PlayerPanel 
            goToNextSlide={goToNextSlide} 
            goToPreviousSlide={goToPreviousSlide} 
            toggleFullscreen={toggleFullscreen}
          />
          <div style={{ width: '100%', overflowX: 'auto' }} id='playerviewslideslist'>
            <PlayerViewSlidesList slidesList={slides} selected={editor.selection} />
          </div>
        </>
      )}
    </div>
  );
}

export default Player;
