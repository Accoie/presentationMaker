import React from 'react'
import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
import { TopPanel } from './view/TopPanel/TopPanel.tsx'
import { SlidesList } from './view/SlideList.tsx'
import { WorkSpace } from './view/WorkSpace.tsx'
import styles from './App.module.css'

type AppProps = {
  editor: tools.EditorType,
}

function App({editor} : AppProps)  {
  return (
    <>
    <div className={styles.presentation}>
      <TopPanel presentationTitle={editor.presentation.title} />
      <div className={styles.presentationcontainer}>
          <SlidesList slidesList={editor.presentation.slides} selected={editor.selection} />
          <WorkSpace presentationData={editor.presentation} selected={editor.selection}/>
      </div>
    </div>
    </>
  )
}

export default App
