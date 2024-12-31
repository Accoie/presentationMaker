import styles from './TopPanel.module.css';
import React from 'react';
import { ImgButton } from '../../components/button/Button.tsx';
import { ElementType, ImgObj } from '/Frontend/presentationMaker/source/presentationMaker.ts';
import { addSlideAction, changeSlideBackgroundAction, removeSlideAction } from '../../../store/actions/editorSlidesActions.ts'
import { importImage } from '../../../store/functions/importImage.ts'
import { renamePresentationTitleAction } from '../../../store/actions/editorPresentationActions.ts'
import { exportEditorAction, importEditorAction, undoEditorAction, redoEditorAction } from '../../../store/actions/editorActions.ts'
import { removeElementAction, addImageToSlideAction, addTextToSlideAction } from '../../../store/actions/editorSlideElementsActions.ts'
import { TextObj } from '../../../../source/presentationMaker.ts';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { UndoableState } from '../../../store/store.ts';
import { generatePDF } from '../../../store/functions/generatePDF.ts';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import GradientPicker from 'react-best-gradient-color-picker'
import { v4 as uuidv4 } from 'uuid';

type TopPanelProps = {
  presentationTitle: string,
}

export const TopPanel = ({ presentationTitle }: TopPanelProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [gradient, setGradient] = useState('');


  const editor = useAppSelector((state: UndoableState) => state.present);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  function onAddSlide() {
    dispatch(addSlideAction());
  }
  function onRemoveSlide() {
    dispatch(removeSlideAction())
  }
  const onTitleChange: React.ChangeEventHandler = (event) => {
    dispatch(renamePresentationTitleAction((event.target as HTMLInputElement).value))
  }
  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleGradientChange = (newGradient: string) => {
    setGradient(newGradient);
    dispatch(changeSlideBackgroundAction(newGradient as string))
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Чтение файла в формате Base64
      reader.onload = () => {
        const base64Image = reader.result as string;
        dispatch(changeSlideBackgroundAction(`url(${base64Image}) no-repeat center center / cover`));
        console.log('Base64 Image:', base64Image);
      };

      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };

      reader.readAsDataURL(file); // Преобразование в Base64
    }
  };
  function onAddImageToSlide() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Ограничение на выбор только изображений

    fileInput.addEventListener('change', async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          const imageUrl = reader.result as string;

          const imgObj: ImgObj = {
            id: uuidv4(),
            type: ElementType.image,
            src: imageUrl,
            size: { width: 200, height: 200 },
            pos: { x: 10, y: 100 },
          };

          dispatch(addImageToSlideAction(imgObj));
        };

        reader.readAsDataURL(file);
      } else {
        alert('Вы не выбрали файл!');
      }
    });

    fileInput.click();
  }
  function onAddTextToSlide() {

    const textObj: TextObj = {
      id: '',
      type: ElementType.text,
      fontSize: 20,
      fontFamily: 'Helvetica',
      src: 'Новый текст',
      size: { width: 200, height: 200 },
      pos: { x: 0, y: 0 }
    };
    dispatch(addTextToSlideAction(textObj))


  }
  function onImportEditorState() {

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';


    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const jsonString = reader.result as string;
            dispatch(importEditorAction(jsonString));

          } catch (error) {
            alert('Ошибка при импорте: некорректный JSON файл.');
            console.error('Error during import:', error);
          }
        };
        reader.onerror = () => {
          alert('Ошибка чтения файла.');
          console.error('FileReader error:', reader.error);
        };
        reader.readAsText(file);
      }
    });

    fileInput.click();
  }

  function onExportEditorState() {
    dispatch(exportEditorAction());
  }
  function onRemoveElement() {
    dispatch(removeElementAction());
  }
  function onUndo() {
    dispatch(undoEditorAction());
  }
  function onRedo() {
    dispatch(redoEditorAction());
  }

  function onGeneratePdf() {
    dispatch(generatePDF(editor));
  }

  const handleOpenModal = () => {
    dispatch(importImage());
  };
  function handleGoToPlayer() {
    return (
      navigate('/player')
    )
  }

  return (
    <div className={styles.toppanel}>
      <input className={styles.title} type="text" defaultValue={presentationTitle} onChange={onTitleChange} />
      <div className={styles.toolbar}>
        <div className={styles.slideslisttoolbar}>
          {/*здесь ссылка в img записывается относительно компонента ImgButton, который находится в components */}
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/import-icon.png'} onClick={onImportEditorState}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/export-icon.png'} onClick={onExportEditorState}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/add-slide.png'} onClick={onAddSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/delete-icon.png'} onClick={onRemoveSlide}></ImgButton>
        </div>
        <div className={styles.workspacetoolbar}>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/add-image.png'} onClick={onAddImageToSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/add-text.png'} onClick={onAddTextToSlide}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/remove-element.png'} onClick={onRemoveElement}></ImgButton>
          <div className={styles.wrapper}>
            <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/change-background-color.png'} onClick={handleToggleOptions}></ImgButton>
            {showOptions && (
              <div className={styles.optionsContainer}>
                {/* Кнопка для выбора градиента */}
                <div className={styles.option}>
                  <GradientPicker
                    value={gradient}
                    onChange={handleGradientChange}
                    className={styles.gradientPicker}
                    hidePresets
                    width={170}
                    height={100}
                    hideAdvancedSliders
                    hideColorGuide
                    hideInputType
                    hideGradientStop
                  />
                </div>
                {/* Кнопка для выбора изображения */}
                <div className={styles.option}>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.imageInputHidden}
                  />
                  <label htmlFor="fileInput" className={styles.imageInputLabel}>
                    <img
                      src={'../../../icons/toppaneleditorview/add-image.png'}
                      alt="Выбрать файл"
                      className={styles.imageInputIcon}
                      
                    />
                    
                  </label>
                </div>
              </div>
            )}
          </div>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/undo.png'} onClick={onUndo}></ImgButton>
          <ImgButton className={styles.toolbarredobutton} img={'../../../icons/toppaneleditorview/undo.png'} onClick={onRedo}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/unsplash.png'} onClick={handleOpenModal}></ImgButton>
        </div>
        <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/pdf-icon.png'} onClick={onGeneratePdf}></ImgButton>
        <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/player-icon.png'} onClick={handleGoToPlayer}></ImgButton>
      </div>
    </div>
  );
};