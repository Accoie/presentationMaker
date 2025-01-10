import { Slide } from '../slide/Slide';
import * as tools from '/Frontend/presentationMaker/types/presentationMaker';
import styles from './WorkSpace.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, UndoableState } from '../../../store/store';
import { setSelectionAction } from '../../../store/actions/editorPresentationActions';
import { undoEditorAction, redoEditorAction } from '../../../store/actions/editorActions';
import React from 'react';
type WorkSpaceProps = {
  presentationData: tools.Presentation,
  selected: tools.PresentationSelection,
};

export const WorkSpace = React.memo(({ presentationData, selected }: WorkSpaceProps) => {
  const selectedSlide: tools.Selection = selected[0] || { slideId: '', elementId: '' };
  const [scale, setScale] = useState(1);
  const dispatch = useAppDispatch();
  const sizeSlide = useAppSelector((state: UndoableState) => state.present.presentation.sizeWorkspace);

  const calculateScale = () => {
    const maxWidth = sizeSlide.width + sizeSlide.width * 0.3;
    const maxHeight = sizeSlide.height;
    const scaleWidth = window.innerWidth / maxWidth;
    const scaleHeight = window.innerHeight / maxHeight;

    return Math.min(scaleWidth, scaleHeight) * 0.8;
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const undoKeys = new Set(['z', 'Z', 'Я', 'я']);
      const redoKeys = new Set(['y', 'Y', 'н', 'Н']);
      const isUndo = (e.ctrlKey || e.metaKey) && undoKeys.has(e.key);
      const isRedo = (e.ctrlKey || e.metaKey) && redoKeys.has(e.key);

      if (isUndo) {
        e.preventDefault();
        dispatch(undoEditorAction());
      } else if (isRedo) {
        e.preventDefault();
        dispatch(redoEditorAction());
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const workspace = document.getElementById('workspace');

      if (workspace?.contains(e.target as Node)) {
        dispatch(setSelectionAction([{ slideId: selectedSlide.slideId, elementId: '' }])); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const workspaceSlide = presentationData.slides.find((slide) => slide.id === selectedSlide.slideId);
  if (!workspaceSlide) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: '1' }}>
        <div style={{ padding: 10, fontFamily: 'Calibri', fontSize: 52, color: '#1E2A78' }}>Выбрал слайд?</div>
        <img src='../../../icons/workspaceeditorview/no-way-found.png' style={{ width: '40%', height: '75%', filter: 'grayscale(0) sepia(1) hue-rotate(190deg) saturate(4.7) brightness(1)' }}></img>
      </div>
    );
  }

  return (
    <div className={styles.workspace} key={selectedSlide.slideId} id='workspace'>
      <div className={styles.scrollcontainer} key={'sdfasdfasd'}>
        <Slide slide={workspaceSlide} scale={scale} selected={{ slideId: selectedSlide.slideId, elementId: selectedSlide.elementId }} isEditorView={true} isWorkspace={true} />
      </div>
    </div>
  );
});
