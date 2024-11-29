import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {addEditorChangeHandler, getEditor} from "/Frontend/presentationMaker/presentationMakerApp/store/editor.ts"
const root = createRoot(document.getElementById('root')!)
function render() {
  root.render(
  <StrictMode>
    <App editor = {getEditor()}/>
  </StrictMode>,
  )
}
addEditorChangeHandler(render)
render()