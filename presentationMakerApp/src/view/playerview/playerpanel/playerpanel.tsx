import { ImgButton } from '../../../components/button/Button.tsx';
import { useNavigate } from 'react-router';
import styles from './PlayerPanel.module.css'
interface PlayerPanelProps {
    goToNextSlide: () => void;
    goToPreviousSlide: () => void;
    toggleFullscreen:() => void;
  }

export const PlayerPanel = ({ goToNextSlide, goToPreviousSlide, toggleFullscreen }: PlayerPanelProps) => {
  const navigate = useNavigate();

  function handleGoToEditor() {
    return (
      navigate('/')
    )  
}
  
    return (
      <>
        {/*здесь ссылка в img записывается относительно компонента ImgButton, который находится в components */}
        <div style={{backgroundColor: '#1E2A78', display: 'flex'}} id='playerpanel'>
        <ImgButton className='' img={'../../../icons/playerpanelplayerview/close.png'} onClick={handleGoToEditor}></ImgButton> 
        <div className={styles.playergotobuttons}>
        <ImgButton className={styles.playerprevbutton} img={'../../../icons/playerpanelplayerview/next.png'} onClick={goToPreviousSlide}></ImgButton> 
        <ImgButton className='' img={'../../../icons/playerpanelplayerview/next.png'} onClick={goToNextSlide}></ImgButton> 
        </div>
        <ImgButton className='' img={'../../../icons/playerpanelplayerview/fullscreen.png'} onClick={toggleFullscreen}></ImgButton> 
        </div>
      </>
    );
  };