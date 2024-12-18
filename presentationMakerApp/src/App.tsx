import { TopPanel } from './view/TopPanel/TopPanel.tsx';
import { SlidesList } from './view/SlideList.tsx';
import { WorkSpace } from './view/WorkSpace.tsx';
import styles from './App.module.css';
import {useAppSelector} from '../store/store.ts'
import { EditorType } from '../../source/presentationMaker.ts';


function App() {
  const editor = useAppSelector((state: EditorType) => state);
  const slides = editor.presentation.slides

  console.log('Editor: ', editor);
  return (
    <>
      <div className={styles.presentation}>
        <TopPanel presentationTitle={editor.presentation.title} />
        <div className={styles.presentationcontainer}>
          <div style={{width: 'auto', height: '100%'}}><SlidesList
            slidesList={slides}
            selected={editor.selection}
          /></div>
          <WorkSpace presentationData={editor.presentation} selected={editor.selection}/>
        </div>
      </div>
    </>
  );
}

export default App;
