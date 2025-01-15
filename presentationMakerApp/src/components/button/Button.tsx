import styles from '../button/Button.module.css'

type TextButtonProps = {
  text: string,
  onClick: () => void,
  className: string,
}

type ImgButtonProps = {
  img: string,
  onClick: () => void,
  className: string,
}

function TextButton({ text, onClick, className }: TextButtonProps) {
  return (
    <button className={`${styles.textbutton} ${className}`} onClick={onClick}>{text}</button>
  )
}


function StandartButton({ img, onClick, className }: ImgButtonProps) {
  return (
    <img className={`${styles.imgbutton} ${className}`} src={img} onClick={onClick}></img>
  )
}
function ToolPanelButton({ img, onClick, className }: ImgButtonProps) {
  return (
    <div><StandartButton className={className} img={img} onClick={onClick}/></div>
  )
}
function SlideShowButton({ img, onClick, className }: ImgButtonProps) {
  return (
    <div><img className={`${styles.slideshowbutton} ${className}`} src={img} onClick={onClick}></img></div>
  )
}
function ActiveButton({ img, onClick, className }: ImgButtonProps) {
  return (
    <div><img className={`${styles.activebutton} ${className}`} src={img} onClick={onClick}></img></div>
  )
}
export {
  TextButton, StandartButton, ToolPanelButton, SlideShowButton, ActiveButton
}