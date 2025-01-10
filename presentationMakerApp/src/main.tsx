import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import './index.css'
import App from './App.tsx'
import {store} from '../store/store.ts'

const root = createRoot(document.getElementById('root')!)

function render() {
  root.render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
  )
}
render()