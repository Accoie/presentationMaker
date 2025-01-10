import styles from './TopPanel.module.css';
import React from 'react';
import { ImgButton } from '../../components/button/Button.tsx';
import { addSlideAction, removeSlideAction } from '../../../store/actions/editorSlidesActions.ts'
import { importImage } from '../../../store/functions/importImage.ts'
import { renamePresentationTitleAction } from '../../../store/actions/editorPresentationActions.ts'
import { exportEditorAction, importEditorAction, undoEditorAction, redoEditorAction } from '../../../store/actions/editorActions.ts'
import { removeElementAction, addImageToSlideAction, addTextToSlideAction } from '../../../store/actions/editorSlideElementsActions.ts'
import { TextObj, ElementType, ImgObj } from '../../../../types/presentationMaker.ts';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { UndoableState } from '../../../store/store.ts';
import { generatePDF } from '../../../store/functions/generatePDF/generatePDF.ts';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { ChangeFontFamily } from './toppanelcomponents/ChangeFontFamily.tsx';
import { ChangeFontSize } from './toppanelcomponents/ChangeFontSize.tsx';
import { ChangeTextColor } from './toppanelcomponents/ChangeTextColor.tsx';
import { ChangeBackgroundColor } from './toppanelcomponents/changebackgroundcolor/ChangeBackgroundColor.tsx';

type TopPanelProps = {
  presentationTitle: string,
}

export const TopPanel = ({ presentationTitle }: TopPanelProps) => {
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

  function onAddImageToSlide() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

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
      fontFamily: 'Arial',
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

  const handleOpenModal = (isBackgroundChange: boolean) => {
    dispatch(importImage(isBackgroundChange));
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
          <ChangeFontSize />
          <ChangeFontFamily />
          <ChangeTextColor />
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/remove-element.png'} onClick={onRemoveElement}></ImgButton>
          <ChangeBackgroundColor />

          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/undo.png'} onClick={onUndo}></ImgButton>
          <ImgButton className={styles.toolbarredobutton} img={'../../../icons/toppaneleditorview/undo.png'} onClick={onRedo}></ImgButton>
          <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/unsplash.png'} onClick={() => handleOpenModal(false)}></ImgButton>
        </div>
        <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/pdf-icon.png'} onClick={onGeneratePdf}></ImgButton>
        <ImgButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/player-icon.png'} onClick={handleGoToPlayer}></ImgButton>
      </div>
    </div>
  );
};