import { TopPanel } from '../toppanel/TopPanel.tsx'
import { SlidesList } from '../slidelist/SlideList.tsx'
import { WorkSpace } from '../workspace/WorkSpace.tsx'
import styles from './EditorView.module.css';
import { useAppSelector, UndoableState } from '../../../store/store.ts';

export function EditorView() {
  const editor = useAppSelector((state: UndoableState) => state.present);
  const slides = editor.presentation.slides;
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

