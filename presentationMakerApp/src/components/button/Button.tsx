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
function TextButton({text, onClick, className}: TextButtonProps) {
    return (
        <button className={`${styles.textbutton} ${className}`} onClick={onClick}>{text}</button>
    )
}
function ImgButton({img, onClick, className}: ImgButtonProps) {
    return (
        <img  className={`${styles.imgbutton} ${className}`} src = {img} onClick={onClick}></img>
    )
}
export {
    TextButton, ImgButton
}