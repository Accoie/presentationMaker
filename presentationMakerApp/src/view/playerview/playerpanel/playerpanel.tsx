import { ImgButton } from '../../../components/button/Button.tsx';
import { useNavigate } from 'react-router';
import styles from './playerpanel.module.css'
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
        <div style={{backgroundColor: '#1E2A78', display: 'flex'}} id='playerpanel'>
        <ImgButton className='' img={'https://cdn-icons-png.flaticon.com/512/566/566013.png'} onClick={handleGoToEditor}></ImgButton> 
        <div className={styles.playergotobuttons}>
        <ImgButton className={styles.playerprevbutton} img={'https://static-00.iconduck.com/assets.00/next-icon-2048x1366-0hja1v4c.png'} onClick={goToPreviousSlide}></ImgButton> 
        <ImgButton className='' img={'https://static-00.iconduck.com/assets.00/next-icon-2048x1366-0hja1v4c.png'} onClick={goToNextSlide}></ImgButton> 
        </div>
        <ImgButton className='' img={'https://static-00.iconduck.com/assets.00/view-fullscreen-symbolic-icon-2048x2048-owdhjagk.png'} onClick={toggleFullscreen}></ImgButton> 
        </div>
    );
  };