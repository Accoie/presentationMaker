import styles from './TopPanel.module.css';
import React from 'react';
import { SlideShowButton, ToolPanelButton } from '../../components/button/Button.tsx';
import { renamePresentationTitleAction, setSelectionAction } from '../../../store/actions/editorPresentationActions.ts'
import { undoEditorAction, redoEditorAction } from '../../../store/actions/editorActions.ts'
import { removeElementAction, addTextToSlideAction } from '../../../store/actions/editorSlideElementsActions.ts'
import { TextObj, ElementType } from '../../../../types/presentationMaker.ts';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { UndoableState } from '../../../store/store.ts';
import { useNavigate } from 'react-router';
import { ChangeFontFamily } from './toppanelcomponents/changefontfamily/ChangeFontFamily.tsx';
import { ChangeFontSize } from './toppanelcomponents/changefontsize/ChangeFontSize.tsx';
import { ChangeTextColor } from './toppanelcomponents/ChangeTextColor.tsx';
import { ChangeBackground } from './toppanelcomponents/changebackground/ChangeBackground.tsx';
import { FilePopUp } from './toppanelcomponents/filepopup/FilePopUp.tsx';
import { AddImagePopUp } from './toppanelcomponents/addimagepopup/AddImagePopUp.tsx';

type TopPanelProps = {
  presentationTitle: string,
}

export const TopPanel = ({ presentationTitle }: TopPanelProps) => {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onTitleChange: React.ChangeEventHandler = (event) => {
    dispatch(renamePresentationTitleAction((event.target as HTMLInputElement).value))
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

  function onRemoveElement() {
    if (editor.selection?.[0]?.elementId) {
      dispatch(removeElementAction());
    }
  }

  function onUndo() {
    dispatch(undoEditorAction());
  }
  
  function onRedo() {
    dispatch(redoEditorAction());
  }

  function handleGoToPlayer() {
    if (editor.presentation.slides) {
      dispatch(setSelectionAction([{ slideId: editor.presentation.slides[0].id, elementId: '' }]));
      return (
        navigate('/player')
      )
    }
  }

  return (
    <div id='toppanel' className={styles.toppanel}>
      <input className={styles.title} type="text" defaultValue={presentationTitle} onChange={(e) => { onTitleChange(e) }} />
      <div className={styles.toolbar}>
        <FilePopUp />
        <div className={styles.workspacetoolbar}>
          <ToolPanelButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/add-text.svg'} onClick={onAddTextToSlide} />
          <ChangeFontFamily />
          <ChangeTextColor />
          <ChangeFontSize />
          <div style={{ paddingRight: '16px' }}><img src='../../../../../icons/toppaneleditorview/Splitter.svg'></img></div>
          <AddImagePopUp />
          <ChangeBackground />
          <div style={{ paddingRight: '16px' }}><img src='../../../../../icons/toppaneleditorview/Splitter.svg'></img></div>
          <ToolPanelButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/undo.svg'} onClick={onUndo} />
          <ToolPanelButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/redo.svg'} onClick={onRedo} />
          <div style={{ paddingRight: '16px' }}><img src='../../../../../icons/toppaneleditorview/Splitter.svg'></img></div>
          <ToolPanelButton className={styles.toolbarbutton} img={'../../../icons/toppaneleditorview/delete.svg'} onClick={onRemoveElement} />
        </div>

        <SlideShowButton className={styles.gotoplayerbutton} img={'../../../icons/toppaneleditorview/gotoplayer.svg'} onClick={handleGoToPlayer} />
      </div>
    </div>
  );
};