import { ImgObj } from '../../../../../types/presentationMaker';

interface ImgElementProps {
  element: ImgObj;
}

export const ImgElement = ({ element }: ImgElementProps) => {
  return (
    <img src={element.src} alt={element.id} style={{ width: '100%', height: '100%' }} ></img>
  )
};