import  { useEffect } from 'react';
import { TopPanel } from './view/TopPanel/TopPanel.tsx';
import { SlidesList } from './view/SlideList.tsx';
import { WorkSpace } from './view/WorkSpace.tsx';
import styles from './App.module.css';
import { useAppSelector, UndoableState, useAppDispatch } from '../store/store.ts';
import { undoEditorAction, redoEditorAction } from '../store/actions/editorActions.ts';

function App() {
  const dispatch = useAppDispatch();
  const editor = useAppSelector((state: UndoableState) => state.present);

  const slides = editor.presentation.slides;

  // Добавляем обработчики клавиш Ctrl+Z и Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        dispatch(undoEditorAction());
      } else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        dispatch(redoEditorAction());
      }
    };

    // Вешаем обработчик событий
    document.addEventListener('keydown', handleKeyDown);

    // Удаляем обработчик при размонтировании
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  console.log('Editor: ', editor);

  return (
    <>
      <div className={styles.presentation}>
        <TopPanel presentationTitle={editor.presentation.title} />
        <div className={styles.presentationcontainer}>
          <div style={{ width: 'auto', height: '100%' }}>
            <SlidesList slidesList={slides} selected={editor.selection} />
          </div>
          <WorkSpace presentationData={editor.presentation} selected={editor.selection} />
        </div>
      </div>
    </>
  );
}

export default App;