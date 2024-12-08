import React, { useState, useEffect } from 'react';
import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts';
import { TopPanel } from './view/TopPanel/TopPanel.tsx';
import { SlidesList } from './view/SlideList.tsx';
import { WorkSpace } from './view/WorkSpace.tsx';
import styles from './App.module.css';
import { dispatch } from '../store/editor.ts';
import { EditorType } from '../../source/presentationMaker.ts';

type AppProps = {
  editor: tools.EditorType,
}

function App({ editor }: AppProps) {

  const slides = editor.presentation.slides
  // const [slides, setSlides] = useState(editor.presentation.slides);

  // useEffect(() => {
  //   setSlides(editor.presentation.slides);
  // }, [editor.presentation.slides]);

  function updateSlides(updatedSlides: tools.Slide[]) {
    dispatch((editor: EditorType) => ({
      ...editor,
      presentation: {
        ...editor.presentation,
        slides: updatedSlides,
      },
    }));
  }
  console.log('Editor: ', editor);
  return (
    <>
      <div className={styles.presentation}>
        <TopPanel presentationTitle={editor.presentation.title} />
        <div className={styles.presentationcontainer}>
          <div style={{width: 'auto', height: '100%'}}><SlidesList
            slidesList={slides}
            selected={editor.selection}
            onUpdateSlides={updateSlides}
          /></div>
          <WorkSpace presentationData={editor.presentation} selected={editor.selection}/>
        </div>
      </div>
    </>
  );
}

export default App;
