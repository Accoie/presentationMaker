import styles from './FilePopUp.module.css'
import { StandartButton, ActiveButton } from '../../../../components/button/Button.tsx'
import { exportEditorAction, importEditorAction } from '../../../../../store/actions/editorActions.ts'
import { useAppDispatch } from '../../../../../store/store.ts';
import { useAppSelector } from '../../../../../store/store.ts';
import { generatePDF } from '../../../../../store/functions/generatePDF/generatePDF.ts';
import { useState, useEffect, useRef } from 'react';


export const FilePopUp = () => {
  const dispatch = useAppDispatch();
  const [showPopUp, setShowPopUp] = useState(false)
  const editor = useAppSelector((state) => state.present);
  const popUpRef = useRef<HTMLDivElement>(null);
  let FilePopUpButton;
  if (!showPopUp) {
    FilePopUpButton = <StandartButton className={styles.filepopupbutton} img={'../../../icons/toppaneleditorview/FilePopUpDisabled.svg'} onClick={() => setShowPopUp(!showPopUp)} />

  } else {
    FilePopUpButton = <ActiveButton className={styles.filepopupbutton} img={'../../../icons/toppaneleditorview/FilePopUpEnabled.svg'} onClick={() => setShowPopUp(!showPopUp)} />

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


  function onGeneratePdf() {
    dispatch(generatePDF(editor));
  }
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (

        !popUpRef.current?.contains(event.target as Node)

      ) {
        setShowPopUp(false);
      }
    };
    if (showPopUp) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => { document.removeEventListener('mousedown', handleMouseDown) }
  }, [showPopUp]);
  return (

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '45px' }}>
      {FilePopUpButton}
      {showPopUp &&
        <div ref={popUpRef} className={styles.popup}>
          <div className={styles.popupbutton} onClick={onImportEditorState}><img src={'../../../icons/toppaneleditorview/ImportPresentation.svg'} /></div>
          <div className={styles.splitter}></div>
          <div className={styles.popupbutton} onClick={onExportEditorState}><img src={'../../../icons/toppaneleditorview/ExportJson.svg'} /></div>
          <div className={styles.splitter}></div>
          <div className={styles.popupbutton} onClick={onGeneratePdf}><img src={'../../../icons/toppaneleditorview/ExportPdf.svg'} /></div>
        </div>
      }
    </div>
  )
}
